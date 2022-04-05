import classes from "./CarSpaceRegistrationForm.module.css";

import BusinessIcon from "@mui/icons-material/Business";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button, CircularProgress, FormHelperText } from "@mui/material";
import Carousel from "react-material-ui-carousel";

import CarSpaceRegistrationSubModal from "./CarSpaceRegistrationSubModal/CarSpaceRegistrationSubModal";
import CarSpaceCardHeader from "../CarSpaceCard/CarSpaceCardHeader";
import CarSpaceCardContentLeft from "../CarSpaceCard/CarSpaceCardContentLeft";
import CarSpaceCardContentRight from "../CarSpaceCard/CarSpaceCardContentRight";
import CarSpaceCardContent from "../CarSpaceCard/CarSpaceCardContent";
import InputField from "../../../UI/InputField/InputField";
import DropdownSelect from "../../../UI/DropdownSelect/DropdownSelect";

import * as config from "../../../../config";
import * as utility from "../../../../utility";

import { useEffect, useReducer, useState } from "react";
import {
  carSpaceFormReducer,
  getCarSpaceFormInitialState,
} from "../../../../reducers/carSpaceForm-reducer";

const CarSpaceRegistrationForm = ({ carSpaceId = null, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [subModal, setSubModal] = useState({
    isOpen: false,
    onClose: () => {},
    title: "",
    content: [],
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDeleteIconVisible, setIsDeleteIconVisible] = useState("hidden");
  const [formState, dispatchFormState] = useReducer(
    carSpaceFormReducer,
    getCarSpaceFormInitialState()
  );

  useEffect(() => {
    const newUploadedImageUrls = [];
    uploadedImages.forEach((image) =>
      newUploadedImageUrls.push(URL.createObjectURL(image))
    );
    dispatchFormState({ type: "IMAGES_INPUT", value: newUploadedImageUrls });
  }, [uploadedImages]);

  useEffect(() => {
    if (!carSpaceId) return;
    const fetchData = async () => {
      try {
        // 1. fetch a space data whose id is carSpaceId
        const authToken = localStorage.getItem("parkItAuthToken");
        const getCarInfoUrl = `${config.SERVER_URL}/api/provider/parking/${carSpaceId}`;
        const getCarInfoOptions = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        };

        const getCarInfoResponse = await utility.sendRequest(
          getCarInfoUrl,
          getCarInfoOptions
        );
        if (getCarInfoResponse.status >= 300 || !getCarInfoResponse.status)
          throw Error;

        // 2. set values for all fields using the fecthed data
        const getImageUrl = `${config.SERVER_URL}/api/provider/parking/images/${carSpaceId}`;
        const getImageOptions = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        };

        const getImageResponse = await utility.sendRequest(
          getImageUrl,
          getImageOptions
        );
        if (getImageResponse.status >= 300 || !getImageResponse.status)
          throw Error;

        const images = getImageResponse.data.map(
          (el) => "data:image/png;base64, " + el.image
        );
        console.log(images);

        dispatchFormState({ type: "FETCH", value: getCarInfoResponse.data });
        dispatchFormState({ type: "IMAGES_INPUT", value: images });
      } catch (e) {
        console.log(e.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [carSpaceId]);

  // Image Upload Handlers
  const imageUploadHandler = (e) => {
    setUploadedImages([...e.target.files]);
  };

  const uploadedImageMouseEnterHandler = (e) => {
    setIsDeleteIconVisible("visible");
  };

  const uploadedImageMouseLeaveHandler = (e) => {
    setIsDeleteIconVisible("hidden");
  };

  const imageDeleteHandler = (e) => {
    const targetImageNum = e.target.dataset.imagenum;
    uploadedImages.splice(targetImageNum, 1);
    setUploadedImages([...uploadedImages]);
  };

  // Address Handlers
  const streetAddressChangeHandler = (e) => {
    dispatchFormState({ type: "STREET_ADDRESS_INPUT", value: e.target.value });
  };

  const cityChangeHandler = (e) => {
    dispatchFormState({ type: "CITY_INPUT", value: e.target.value });
  };

  const stateChangeHandler = (e) => {
    dispatchFormState({ type: "STATE_INPUT", value: e.target.value });
  };

  const postCodeChangeHandler = (e) => {
    dispatchFormState({ type: "POSTCODE_INPUT", value: e.target.value });
  };

  // Price/Vehicle Size/Notes Handler
  const priceChangeHandler = (e) => {
    dispatchFormState({ type: "PRICE_INPUT", value: e.target.value });
  };

  const maxVehicleSizeChangeHandler = (e) => {
    dispatchFormState({
      type: "MAX_VEHICLE_SIZE_INPUT",
      value: e.target.value,
    });
  };

  const notesChangeHandler = (e) => {
    dispatchFormState({ type: "NOTES_INPUT", value: e.target.value });
  };

  // Form Submission
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // Base64 Encoding for images
      const imagesInBase64 = await utility.convertImagesToBase64(
        uploadedImages
      );

      // Get username
      const authToken = localStorage.getItem("parkItAuthToken");
      if (!authToken) return;

      const getUserDataUrl = `${config.SERVER_URL}/api/auth/user/`;
      const getUserDataoptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + authToken,
        },
      };

      // Send Car Space Registration Data to Backend
      setIsLoading(true);
      const getUserDataResponse = await utility.sendRequest(
        getUserDataUrl,
        getUserDataoptions
      );

      if (!getUserDataResponse.status)
        throw Error(config.NETWORK_ERROR_MESSAGE);

      if (getUserDataResponse.status >= 300) {
        const errorMsgs = [];
        for (const [key, value] of Object.entries(getUserDataResponse.data)) {
          errorMsgs.push(` - ${key}: ${value}`);
        }
        throw Error(errorMsgs);
      }

      if (carSpaceId === null) {
        // for (const image of imagesInBase64) {
        //   const carSpaceRegistrationImageUploadUrl = `${config.SERVER_URL}/api/provider/image/${carSpaceId}`;
        //   const carSpaceRegistrationImageUploadOptions = {
        //     method: "POST",
        //     headers: {
        //       Authorization: "Bearer " + authToken,
        //       "Content-Type": "application/json",
        //     },
        //     body: {
        //       parkingSpace: carSpaceId,
        //       image: image,
        //     },
        //   };
        //   const carSpaceRegistrationImageUploadResponse =
        //     await utility.sendRequest(
        //       carSpaceRegistrationImageUploadUrl,
        //       carSpaceRegistrationImageUploadOptions
        //     );
        //   if (!carSpaceRegistrationImageUploadResponse.status)
        //     throw Error(config.NETWORK_ERROR_MESSAGE);
        //   if (carSpaceRegistrationImageUploadResponse.status >= 300) {
        //     const errorMsgs = [];
        //     for (const key of Object.keys(
        //       carSpaceRegistrationImageUploadResponse.data
        //     )) {
        //       errorMsgs.push(` - Not a valid ${key}.`);
        //     }
        //     throw Error(errorMsgs);
        //   }
        // }
      } else {
        const carSpaceUpdateDeleteImagesUrl = `${config.SERVER_URL}/api/provider/image/${carSpaceId}`;
        const carSpaceUpdateDeleteImagesOptions = {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        };

        const carSpaceUpdateDeleteImagesResponse = await utility.sendRequest(
          carSpaceUpdateDeleteImagesUrl,
          carSpaceUpdateDeleteImagesOptions
        );
        if (!carSpaceUpdateDeleteImagesResponse.status)
          throw Error(config.NETWORK_ERROR_MESSAGE);
        if (carSpaceUpdateDeleteImagesResponse.status >= 300) {
          const errorMsgs = [];
          for (const key of Object.keys(
            carSpaceUpdateDeleteImagesResponse.data
          )) {
            errorMsgs.push(` - Not a valid ${key}.`);
          }
          throw Error(errorMsgs);
        }
      }

      const formData = {
        provider: getUserDataResponse.data.pk,
        streetAddress: formState.streetAddress.value,
        city: formState.city.value,
        state: formState.state.value,
        postcode: formState.postcode.value,
        price: formState.price.value,
        size: formState.maxVehicleSize.value,
        image: imagesInBase64,
        notes: formState.notes.value,
      };
      const carSpaceRegistrationUrl = `${
        config.SERVER_URL
      }/api/provider/parking${carSpaceId === null ? "" : `/${carSpaceId}`}`;

      const carSpaceRegistrationOptions = {
        method: carSpaceId === null ? "POST" : "PUT",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        body: formData,
      };
      const carSpaceRegistrationResponse = await utility.sendRequest(
        carSpaceRegistrationUrl,
        carSpaceRegistrationOptions
      );
      setIsLoading(false);

      if (!carSpaceRegistrationResponse.status)
        throw Error(config.NETWORK_ERROR_MESSAGE);
      if (carSpaceRegistrationResponse.status >= 300) {
        const errorMsgs = [];
        for (const key of Object.keys(carSpaceRegistrationResponse.data)) {
          errorMsgs.push(` - Not a valid ${key}.`);
        }
        throw Error(errorMsgs);
      }

      setSubModal({
        isOpen: true,
        onClose: closeAllHandler,
        title: "Success",
        content: ["Your space has been successfully registered"],
      });
    } catch (e) {
      setSubModal({
        isOpen: true,
        onClose: closeSubModalHandler,
        title: "Error",
        content: e.message.split(","),
      });
    }
  };
  // Close handlers
  const closeSubModalHandler = () => {
    setSubModal((prev) => {
      const newSubModal = { ...prev, isOpen: false };
      return newSubModal;
    });
  };
  const closeAllHandler = () => {
    setSubModal((prev) => {
      const newSubModal = { ...prev, isOpen: false };
      return newSubModal;
    });
    onClose();
  };

  return (
    <form onSubmit={formSubmitHandler}>
      <CarSpaceRegistrationSubModal
        open={subModal.isOpen}
        onClose={subModal.onClose}
        title={subModal.title}
        content={subModal.content}
      />
      <CarSpaceCardHeader
        title={
          carSpaceId === null ? "Car space registration" : "Car space edit"
        }
        onClose={onClose}
      />
      <CarSpaceCardContent>
        <CarSpaceCardContentLeft>
          <div className={classes["image-upload-container"]}>
            <Carousel
              className={classes["image-container"]}
              autoPlay={false}
              animation="slide"
              indicators={false}
            >
              {formState.images.value.map((imgSrc, idx) => (
                <div className={classes["image-item"]} key={imgSrc}>
                  <img
                    src={imgSrc}
                    alt={"car-space"}
                    onMouseEnter={uploadedImageMouseEnterHandler}
                    onMouseLeave={uploadedImageMouseLeaveHandler}
                  />
                  <DeleteOutlineIcon
                    className={classes["delete-icon"]}
                    fontSize="large"
                    sx={{ visibility: isDeleteIconVisible }}
                    onClick={imageDeleteHandler}
                    data-imagenum={idx}
                  />
                </div>
              ))}
            </Carousel>
            <div className={classes["image-uploader"]}>
              <InputField
                type="file"
                onChange={imageUploadHandler}
                multiple={true}
              />
              <FormHelperText>* Plase upload at least 1 image</FormHelperText>
            </div>
          </div>
          <div className={classes.actions}>
            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={!formState.isFormValid}
            >
              {isLoading ? (
                <CircularProgress size="1.5rem" />
              ) : carSpaceId === null ? (
                "Registration"
              ) : (
                "Edit"
              )}
            </Button>
          </div>
        </CarSpaceCardContentLeft>
        <CarSpaceCardContentRight>
          <div className={classes.details}>
            <div className={classes.details__item}>
              <BusinessIcon className={classes.icon} fontSize="large" />
              <div className={classes.details__item__content}>
                <InputField
                  className={classes["input-container"]}
                  inputClassName={classes.input}
                  label="Street Address"
                  type="text"
                  name="street"
                  value={formState.streetAddress.value}
                  onChange={streetAddressChangeHandler}
                  disabled={formState.streetAddress.disabled}
                />
                <InputField
                  className={classes["input-container"]}
                  inputClassName={classes.input}
                  label="City"
                  type="text"
                  name="city"
                  value={formState.city.value}
                  onChange={cityChangeHandler}
                  disabled={formState.city.disabled}
                />
                <div className={classes.details__item__content__row}>
                  <DropdownSelect
                    className={`${classes.input} ${classes.field}`}
                    selectClassName={classes.input}
                    selectMenuClassName={classes["select-menu"]}
                    selectItemClassName={classes["select-item"]}
                    labelId="stateLabelId"
                    selectId="stateSelectId"
                    label="State"
                    value={formState.state.value}
                    onChange={stateChangeHandler}
                    items={config.AUS_STATES}
                    disabled={formState.state.disabled}
                  />
                  <InputField
                    className={classes.input}
                    inputClassName={classes.input}
                    label="Postal Code"
                    type="number"
                    name="postcode"
                    value={formState.postcode.value}
                    onChange={postCodeChangeHandler}
                    disabled={formState.postcode.disabled}
                  />
                </div>
              </div>
            </div>
            <div className={classes.details__item}>
              <AttachMoneyIcon
                className={classes.icon}
                fontSize="large"
                color="yellow"
              />
              <InputField
                className={classes.input}
                inputClassName={classes.input}
                label="Price (Hourly rate)"
                type="number"
                name="price"
                value={formState.price.value}
                onChange={priceChangeHandler}
              />
            </div>
            <div className={classes.details__item}>
              <DirectionsCarIcon className={classes.icon} fontSize="large" />
              <DropdownSelect
                className={`${classes.input} ${classes.field}`}
                selectClassName={classes.input}
                selectMenuClassName={classes["select-menu"]}
                selectItemClassName={classes["select-item"]}
                labelId="maxVehicleSizeLabelId"
                selectId="maxVehicleSizeSelectId"
                label="Max Vehicle Size"
                value={formState.maxVehicleSize.value}
                onChange={maxVehicleSizeChangeHandler}
                items={config.VEHICLE_TYPES}
              />
            </div>
            <div className={classes.notes}>
              <StickyNote2Icon className={classes.icon} fontSize="large" />
              <InputField
                className={classes.input}
                label="Notes"
                type="text"
                name="notes"
                multiline={true}
                maxRows={3}
                minRows={3}
                value={formState.notes.value}
                onChange={notesChangeHandler}
                placeholder={`Please type N/A if nothing to type here.`}
              />
            </div>
          </div>
        </CarSpaceCardContentRight>
      </CarSpaceCardContent>
    </form>
  );
};

export default CarSpaceRegistrationForm;
