import React, { useEffect, useState } from 'react';
import {
  getGroupList,
  deleteGroup,
  deleteGroups,
} from '../../services/adminService.js';
import { formatDate } from '../common/FormatDate.jsx';
import '../../css/admin/AdminUser.css'; // 관리자 스타일 CSS 파일

const AdminGroupList = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // 페이지 상태 추가
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수 상태 추가
  const [sortBy, setSortBy] = useState('latest'); // 기본 정렬값 설정

  const fetchGroups = async (page, sortOrder) => {
    try {
      const data = await getGroupList(page, sortOrder);
      setGroups(data.content);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups(page, sortBy);
  }, [page, sortBy]);

  // 그룹 삭제
  const groupDelete = async (courseGroupSeq) => {
    const confirmDelete = window.confirm('그룹을 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await deleteGroup(courseGroupSeq);
        alert('그룹이 성공적으로 삭제되었습니다.');
        fetchGroups(page, sortBy); // 삭제 후 그룹 목록 다시 불러오기
      } catch (error) {
        console.error('Error deleting group:', error);
        setError(error);
      }
    }
  };

  // 여러 그룹 삭제
  const deleteSelectedGroups = async () => {
    if (selectedGroups.length === 0) {
      alert('삭제할 그룹을 선택하세요.');
      return;
    }
    const confirmDelete = window.confirm('선택한 그룹을 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await deleteGroups(selectedGroups);
        alert('선택한 그룹이 성공적으로 삭제되었습니다.');
        fetchGroups(page, sortBy); // 삭제 후 그룹 목록 다시 불러오기
        setSelectedGroups([]);
      } catch (error) {
        console.error('Error deleting groups:', error);
        setError(error);
      }
    }
  };

  const toggleSelectGroup = (courseGroupSeq) => {
    setSelectedGroups((prevSelected) =>
      prevSelected.includes(courseGroupSeq)
        ? prevSelected.filter((seq) => seq !== courseGroupSeq)
        : [...prevSelected, courseGroupSeq]
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="adminUserList">
      <h1>전체 그룹</h1>
      <div className="filtering">
        <div className="filter">
          <button onClick={() => setSortBy('latest')}>최신순</button>
          <button onClick={() => setSortBy('oldest')}>오래된 순</button>
        </div>
      </div>
      <div className="userSelect">
        <button onClick={deleteSelectedGroups}>선택한 그룹 삭제</button>
        <p>선택된 그룹: {selectedGroups.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ width: '10%' }}>선택</th>
            <th style={{ width: '15%' }}>번호</th>
            <th style={{ width: '22%' }}>제목</th>
            <th style={{ width: '23%' }}>생성 일자</th>
            <th style={{ width: '15%' }}>삭제</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.courseGroupSeq}>
              <td>
                <input
                  type="checkbox"
                  className="styled-checkbox"
                  id={`checkbox-${group.courseGroupSeq}`}
                  onChange={() => toggleSelectGroup(group.courseGroupSeq)}
                  checked={selectedGroups.includes(group.courseGroupSeq)}
                />
                <label htmlFor={`checkbox-${group.courseGroupSeq}`}></label>
              </td>
              <td>{group.courseGroupSeq}</td>
              <td className="left-align">{group.title}</td>
              <td>{formatDate(group.createDate)}</td>
              <td>
                <button
                  className="delBtn btn_type_1"
                  onClick={() => groupDelete(group.courseGroupSeq)}
                >
                  삭제
                </button>
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

export default AdminGroupList;
