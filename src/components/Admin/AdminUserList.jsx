import React, { useEffect, useState, useRef } from 'react';
import {
  getUserList,
  deleteUser,
  deleteUsers,
} from '../../services/adminService';
import { formatDate } from '../common/FormatDate';
import { useNavigate } from 'react-router-dom';
import '../../css/admin/AdminUser.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('latest');
  const [totalCount, setTotalCount] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]); // 회원 선택
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('최신순');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUserList(page, sortBy);
        setUsers(data.content);
        setTotalCount(data.totalElements);

        // 탈퇴 회원 수 계산
        const deletedUsers = data.content.filter((user) => user.delYn === 'Y');
        setDeletedCount(deletedUsers.length);
      } catch (err) {
        setError(err);
      }
    };
    fetchUsers();
  }, [page, sortBy]);

  // 로그인 타입 null 데이터 '이메일'로 변경
  const getLoginType = (oauthType) => {
    switch (oauthType) {
      case 'google':
        return '구글';
      case 'kakao':
        return '카카오';
      case 'naver':
        return '네이버';
      default:
        return '이메일';
    }
  };

  // 회원 탈퇴
  const userDelete = async (userSeq, username) => {
    const confirmDelete = window.confirm(
      `${username} 회원을 탈퇴시키겠습니까?`
    );
    if (confirmDelete) {
      try {
        await deleteUser(userSeq);
        alert('회원을 탈퇴시켰습니다.');
        setUsers(users.filter((user) => user.userSeq !== userSeq));

        // 탈퇴 회원 수 업데이트
        setDeletedCount(deletedCount + 1);
      } catch (error) {
        alert('회원 탈퇴에 실패하였습니다.');
        console.error('Error deleting user:', error);
      }
    }
  };

  // 선택된 회원 탈퇴
  const selectDelete = async () => {
    if (selectedUsers.length === 0) {
      alert('탈퇴시킬 회원을 선택해주세요.');
      return;
    }

    const confirmDelete = window.confirm(
      `${selectedUsers.length}명의 회원을 탈퇴시키겠습니까?`
    );
    if (confirmDelete) {
      try {
        await deleteUsers(selectedUsers);
        alert('선택된 회원들을 탈퇴시켰습니다.');
        setUsers(users.filter((user) => !selectedUsers.includes(user.userSeq)));
        setSelectedUsers([]); // 선택 목록 초기화

        // 탈퇴 회원 수 업데이트
        setDeletedCount(deletedCount + selectedUsers.length);
      } catch (error) {
        alert('회원 탈퇴에 실패하였습니다.');
        console.error('Error deleting users:', error);
      }
    }
  };

  // 선택된 회원 변경
  const toggleSelectUser = (userSeq) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userSeq)
        ? prevSelected.filter((seq) => seq !== userSeq)
        : [...prevSelected, userSeq]
    );
  };

  // 필터링된 사용자 목록
  const filterUsers = users.filter((user) => {
    if (filter === 'all') return true;
    return filter === 'deleted' ? user.delYn === 'Y' : user.delYn === 'N';
  });

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownClick = (option) => {
    setSelectedOption(option);
    setSortBy(option === '최신순' ? 'latest' : 'oldest');
    setDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="adminUserList">
      <h1>전체 회원 목록</h1>
      <div className="filtering">
        <div className="filter">
          <button onClick={() => setFilter('all')}>전체 : {totalCount}</button>
          <button onClick={() => setFilter('active')}>
            회원 : {totalCount - deletedCount}
          </button>
          <button onClick={() => setFilter('deleted')}>
            탈퇴 회원 : {deletedCount}
          </button>
        </div>

        <div className="sort" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="dropDownBtn">
            <div className="text">{selectedOption}</div>
            <FontAwesomeIcon
              icon={dropdownOpen ? faChevronUp : faChevronDown}
            />
          </button>
          {dropdownOpen && (
            <div className={`dropdownContent ${dropdownOpen ? 'show' : ''}`}>
              <a onClick={() => handleDropdownClick('최신순')}>최신순</a>
              <a onClick={() => handleDropdownClick('오래된순')}>오래된순</a>
            </div>
          )}
        </div>
      </div>
      <div className="userSelect">
        <button onClick={selectDelete}>선택 회원 탈퇴</button>
        <p>선택된 회원 : {selectedUsers.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ width: '8%' }}>선택</th>
            <th style={{ width: '10%' }}>순차번호</th>
            <th style={{ width: '22%' }}>이메일</th>
            <th style={{ width: '15%' }}>로그인 타입</th>
            <th style={{ width: '18%' }}>가입일</th>
            <th style={{ width: '12%' }}>탈퇴 여부</th>
            <th style={{ width: '10%' }}>탈퇴</th>
          </tr>
        </thead>
        <tbody>
          {filterUsers.map((user) => (
            <tr
              key={user.userSeq}
              className={user.delYn === 'Y' ? 'deleted-user' : ''}
            >
              <td>
                <input
                  type="checkbox"
                  className="styled-checkbox"
                  id={`checkbox-${user.userSeq}`}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleSelectUser(user.userSeq);
                  }}
                  checked={selectedUsers.includes(user.userSeq)}
                />
                <label htmlFor={`checkbox-${user.userSeq}`}></label>
              </td>
              <td onClick={() => navigate(`/admin/userDetail/${user.userSeq}`)}>
                {user.userSeq}
              </td>
              <td onClick={() => navigate(`/admin/userDetail/${user.userSeq}`)}>
                {user.username}
              </td>
              <td onClick={() => navigate(`/admin/userDetail/${user.userSeq}`)}>
                {getLoginType(user.oauthType)}
              </td>
              <td onClick={() => navigate(`/admin/userDetail/${user.userSeq}`)}>
                {formatDate(user.registerDate)}
              </td>
              <td onClick={() => navigate(`/admin/userDetail/${user.userSeq}`)}>
                {user.delYn === 'Y' ? (
                  <span className="deleted">탈퇴 회원</span>
                ) : (
                  '활동 중'
                )}
              </td>
              <td>
                {user.delYn !== 'Y' && (
                  <button
                    className="delBtn btn_type_1"
                    onClick={(e) => {
                      e.stopPropagation();
                      userDelete(user.userSeq, user.username);
                    }}
                  >
                    탈퇴
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page <= 0}>
          이전
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default AdminUserList;
