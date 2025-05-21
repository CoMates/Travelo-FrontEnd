import React, { useEffect, useState } from 'react';
import { getAdminData } from '../../services/adminService';
import { Link } from 'react-router-dom';
import '../../css/admin/AdminMain.css';

const AdminMain = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdminData();
        setData(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container">
      <h1>관리자 페이지</h1>
      <div className="admin-inner">
        <div className="card">
          <Link to="/admin/users">
            <div className="card-content">
              <h3>전체 회원</h3>
              <p>{data['user count']}</p>
            </div>
          </Link>
        </div>
        <div className="card">
          <Link to="/admin/groups">
            <div className="card-content">
              <h3>전체 그룹</h3>
              <p>{data['group count']}</p>
            </div>
          </Link>
        </div>
        <div className="card">
          <Link to="/admin/courses">
            <div className="card-content">
              <h3>전체 코스</h3>
              <p>{data['course count']}</p>
            </div>
          </Link>
        </div>
        <div className="card">
          <Link to="/admin/reviews">
            <div className="card-content">
              <h3>전체 리뷰</h3>
              <p>{data['review count']}</p>
            </div>
          </Link>
        </div>
        <div className="card">
          <Link to="/admin/blindReviews">
            <div className="card-content">
              <h3>블라인드 리뷰</h3>
              <p>{data['reported5plus count']}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
