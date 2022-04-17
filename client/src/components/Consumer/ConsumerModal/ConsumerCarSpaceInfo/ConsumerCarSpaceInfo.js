import { useContext, useEffect, useState } from "react";

import * as config from "../../../../config";
import * as utility from "../../../../utility";

import ConsumerModalContext from "../../../../contexts/consumer-modal-context";

import CarSpaceInfo from "../../../UI/CarSpaceUI/CarSpaceInfo/CarSpaceInfo";
import AuthContext from "../../../../contexts/auth-context";

const ConsumerCarSpaceInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const consumerModalContext = useContext(ConsumerModalContext);
  const authContext = useContext(AuthContext);

  const makeBookingHandler = () => {
    consumerModalContext.openPage("/book");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(false);
        if (consumerModalContext.carSpaceInfo.fetched) return;

        setIsLoading(true);
        const authToken = localStorage.getItem("parkItAuthToken");
        const url = `${config.SERVER_URL}/api/provider/parking/${consumerModalContext.carSpaceId}`;
        const options = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        };

        const response = await utility.sendRequest(url, options, setIsLoading);
        if (response.status >= 300 || !response.status) throw Error;

        const favouriteUrl = `${config.SERVER_URL}/api/consumer/favourite/all`;
        const favouriteOptions = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        };

        const favouriteResponse = await utility.sendRequest(
          favouriteUrl,
          favouriteOptions
        );
        setIsLoading(false);

        if (!favouriteResponse.status || favouriteResponse.status >= 300)
          throw Error;

        const currentUserId = authContext.userInfo.pk;
        const currentParkingSpaceId = consumerModalContext.carSpaceId;
        for (const favObj of favouriteResponse.data) {
          if (
            favObj.consumer === currentUserId &&
            favObj.parkingSpace === currentParkingSpaceId
          ) {
            consumerModalContext.setFavourite({ id: favObj.pk, value: true });
            break;
          }
        }

        consumerModalContext.fetchCarSpaceInfo(response.data);
      } catch (e) {
        setIsLoading(false);
        setError(true);
      }
    };

    fetchData();
  }, [authContext.userInfo.pk, consumerModalContext, setIsLoading]);

  return (
    <CarSpaceInfo
      title={"Car Space Information"}
      actions={[
        { content: "Book", color: "primary", onClick: makeBookingHandler },
      ]}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      error={error}
      setError={setError}
      onClose={consumerModalContext.closeModal}
      modalContext={consumerModalContext}
      favourite={true}
    />
  );
};

export default ConsumerCarSpaceInfo;
