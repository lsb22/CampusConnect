import { useEffect } from "react";
import useMessageStore from "../store/LatestMessagesStore";
import { Socket } from "socket.io-client";

const getUserLocation = (socket: Socket) => {
  const { setLocation } = useMessageStore();

  const fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        const username = socket.username ? socket.username : "";

        setLocation(latitude, longitude);
        socket.emit("locationUpdate", { latitude, longitude, username });
      },
      (err) => {
        console.log(err);
      },
      {
        timeout: 5000,
      }
    );
  };

  useEffect(() => {
    fetchLocation();
    const intervalId = setInterval(fetchLocation, 20000);

    return () => clearInterval(intervalId);
  }, []);
};

export default getUserLocation;
