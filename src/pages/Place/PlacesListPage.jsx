import ListContent from '../../components/common/ListContent.jsx';
import Sidebar from '../../components/common/Sidebar.jsx';
import { PlaceProvider } from '../../contexts/PlaceContext.jsx';

const PlacesListPage = () => {
  return (
    <PlaceProvider>
      <div className="grid-container">
        <Sidebar />
        <ListContent />
      </div>
    </PlaceProvider>
  );
};

export default PlacesListPage;
