import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getUserDetail,
  deleteUser,
  getUserCourses,
  getUserReviews,
  getUserGroups,
} from '../../services/adminService';
import { formatDate } from '../common/formatDate';

const AdminUserDetail = () => {
  const { userSeq } = useParams();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [courseSortBy, setCourseSortBy] = useState('latest');
  const [reviewSortBy, setReviewSortBy] = useState('latest');
  const [groupSortBy, setGroupSortBy] = useState('latest');

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const data = await getUserDetail(userSeq);
        setUser(data);
      } catch (err) {
        setError(err);
      }
    };

    const fetchUserCourses = async () => {
      try {
        const data = await getUserCourses(userSeq, courseSortBy);
        setCourses(data.content);
      } catch (err) {
        setError(err);
      }
    };

    const fetchUserReviews = async () => {
      try {
        const data = await getUserReviews(userSeq, reviewSortBy);
        setReviews(data.content);
      } catch (err) {
        setError(err);
      }
    };

    const fetchUserGroups = async () => {
      try {
        const data = await getUserGroups(userSeq, groupSortBy);
        setGroups(data.content);
      } catch (err) {
        setError(err);
      }
    };

    fetchUserDetail();
    fetchUserCourses();
    fetchUserReviews();
    fetchUserGroups();
  }, [userSeq, courseSortBy, reviewSortBy, groupSortBy]);

  const deleteUserBtn = async () => {
    if (window.confirm('정말로 이 회원을 탈퇴시키겠습니까?')) {
      try {
        await deleteUser(userSeq);
        alert('회원이 성공적으로 탈퇴되었습니다.');
        setUser({ ...user, delYn: 'Y', resignDate: new Date().toISOString() });
      } catch (err) {
        console.error('회원 탈퇴 오류 :', err);
        alert('회원 탈퇴에 실패하였습니다.');
      }
    }
  };

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

  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="adminUserDetail">
      <h1>회원 상세 정보</h1>
      {user ? (
        <>
          <p>순차번호: {user.userSeq}</p>
          <p>이메일: {user.username}</p>
          <p>전화번호: {user.tel}</p>
          <p>가입일자: {formatDate(user.registerDate)}</p>
          <p>정보 수정일자: {formatDate(user.modifyDate)}</p>
          <p>로그인 타입: {getLoginType(user.oauthType)}</p>
          <p>탈퇴여부: {user.delYn === 'Y' ? '탈퇴 회원' : '활성 회원'}</p>
          {user.delYn === 'Y' && <p>탈퇴일자: {formatDate(user.resignDate)}</p>}
          {user.delYn === 'N' ? (
            <button onClick={deleteUserBtn}>회원 탈퇴</button>
          ) : (
            <button disabled>탈퇴 회원</button>
          )}

          <h2>회원이 만든 코스 목록</h2>
          <div className="sort">
            <button onClick={() => setCourseSortBy('latest')}>최신순</button>
            <button onClick={() => setCourseSortBy('oldest')}>오래된 순</button>
          </div>
          <ul>
            {courses.map((course) => (
              <li key={course.courseSeq}>
                <h3>{course.title}</h3>
                <p>{formatDate(course.createDate)}</p>
              </li>
            ))}
          </ul>

          <h2>회원이 작성한 후기 목록</h2>
          <div className="sort">
            <button onClick={() => setReviewSortBy('latest')}>최신순</button>
            <button onClick={() => setReviewSortBy('oldest')}>오래된 순</button>
          </div>
          <ul>
            {reviews.map((review) => (
              <li key={review.reviewSeq}>
                <h3>{review.courseTitle}</h3>
                <p>{review.content}</p>
                <p>{formatDate(review.createDate)}</p>
              </li>
            ))}
          </ul>

          <h2>회원이 가입한 그룹 목록</h2>
          <div className="sort">
            <button onClick={() => setGroupSortBy('latest')}>최신순</button>
            <button onClick={() => setGroupSortBy('oldest')}>오래된 순</button>
          </div>
          <ul>
            {groups.map((group) => (
              <li key={group.groupSeq}>
                <h3>{group.title}</h3>
                <p>{formatDate(group.createDate)}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AdminUserDetail;
