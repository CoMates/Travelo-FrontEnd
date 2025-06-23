import { useContext, useEffect } from 'react';
import ListContent from '../../components/common/ListContent.jsx';
import Sidebar from '../../components/common/Sidebar.jsx';
import { PlaceContext } from '../../contexts/PlaceContext.jsx';

const PlacesListPage = () => {
  const { fetchUserBookmarks } = useContext(PlaceContext);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      fetchUserBookmarks(accessToken);
    }
  }, [fetchUserBookmarks]);

  return (
    <div className="grid-container">
      <Sidebar />
      <ListContent />
    </div>
  );
};

export default PlacesListPage;
