import { useEffect, useState } from 'react';
import axios from 'axios';

const usePlaceDetails = (contentId, type, placeSeq) => {
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      const apikey = import.meta.env.VITE_API_TOUR_KEY;
      const url = `http://apis.data.go.kr/B551011/KorService1/detailIntro1?serviceKey=${apikey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${contentId}&contentTypeId=${type}`;

      try {
        const response = await axios.get(url);
        const items = response.data.response.body.items.item;
        if (items && items.length > 0) {
          setPlaceDetails(items[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching place details:', error);
        setError(error);
        setLoading(false);
      }
    };

    // const increaseViewCount = async () => {
    //   try {
    //     await axios.post(
    //       `http://localhost:8080/travelo/place/detail/${placeSeq}`,
    //       {},
    //       {
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         withCredentials: true,
    //       }
    //     );
    //   } catch (error) {
    //     console.error('Error increasing view count:', error);
    //   }
    // };

    fetchPlaceDetails();
    // increaseViewCount();
  }, [contentId, type, placeSeq]);

  return { placeDetails, loading, error };
};

export default usePlaceDetails;
