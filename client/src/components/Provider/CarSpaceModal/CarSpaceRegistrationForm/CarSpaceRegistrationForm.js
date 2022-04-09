import classes from "./CarSpaceRegistrationForm.module.css";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BusinessIcon from "@mui/icons-material/Business";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { Button, CircularProgress, TextField } from "@mui/material";

import CarSpaceFormSubModal from "../CarSpaceForm/CarSpaceFormSubModal/CarSpaceFormSubModal";
import CarSpaceCardHeader from "../CarSpaceCard/CarSpaceCardHeader";
import CarSpaceCardContentLeft from "../CarSpaceCard/CarSpaceCardContentLeft";
import CarSpaceCardContentRight from "../CarSpaceCard/CarSpaceCardContentRight";
import CarSpaceCardContent from "../CarSpaceCard/CarSpaceCardContent";
import InputField from "../../../UI/InputField/InputField";
import DropdownSelect from "../../../UI/DropdownSelect/DropdownSelect";

import * as config from "../../../../config";
import * as utility from "../../../../utility";

import { useContext, useEffect, useReducer, useState } from "react";
import {
  carSpaceFormReducer,
  getCarSpaceFormInitialState,
} from "../../../../reducers/carSpaceForm-reducer";
import CarSpaceFormImageCarousel from "../CarSpaceForm/CarSpaceFormImageCarousel/CarSpaceFormImageCarousel";
import AuthContext from "../../../../contexts/auth-context";
import CarSpaceModalContext from "../../../../contexts/carspace-modal-context";

const CarSpaceRegistrationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [subModal, setSubModal] = useState({
    isOpen: false,
    onClose: () => {},
    title: "",
    content: [],
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formState, dispatchFormState] = useReducer(
    carSpaceFormReducer,
    getCarSpaceFormInitialState()
  );
  const authContext = useContext(AuthContext);
  const carSpaceModalContext = useContext(CarSpaceModalContext);

  // Image Upload Handlers
  useEffect(() => {
    const newUploadedImageUrls = [];
    uploadedImages.forEach((image) =>
      newUploadedImageUrls.push(URL.createObjectURL(image))
    );
    dispatchFormState({ type: "IMAGES_INPUT", value: newUploadedImageUrls });
  }, [uploadedImages]);

  const imageUploadHandler = (e) => {
    setUploadedImages([...e.target.files]);
  };

  const imageDeleteHandler = (e) => {
    const targetImageNum = e.target.dataset.imagenum;
    uploadedImages.splice(targetImageNum, 1);
    setUploadedImages([...uploadedImages]);
  };

  // Address Handlers
  const streetNumberChangeHandler = (e) => {
    dispatchFormState({ type: "STREET_NUMBER_INPUT", value: e.target.value });
  };

  const streetNameChangeHandler = (e) => {
    dispatchFormState({ type: "STREET_NAME_INPUT", value: e.target.value });
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

      const authToken = localStorage.getItem("parkItAuthToken");
      if (!authToken) return;

      const formData = {
        provider: authContext.userInfo.pk,
        startTime: formState.startDateTime.value,
        endTime: formState.endDateTime.value,
        streetAddress: `${formState.streetNumber.value} ${formState.streetName.value}`,
        city: formState.city.value,
        state: formState.state.value,
        postcode: formState.postcode.value,
        price: formState.price.value,
        size: formState.maxVehicleSize.value,
        images: imagesInBase64,
        notes: formState.notes.value,
      };
      console.log(formData);
      const carSpaceRegistrationUrl = `${config.SERVER_URL}/api/provider/parking`;
      const carSpaceRegistrationOptions = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        body: formData,
      };
      const carSpaceRegistrationResponse = await utility.sendRequest(
        carSpaceRegistrationUrl,
        carSpaceRegistrationOptions,
        setIsLoading
      );

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

  // CloseSubModal handlers
  const closeSubModalHandler = () => {
    setSubModal((prev) => {
      return { ...prev, isOpen: false };
    });
  };
  const closeAllHandler = () => {
    setSubModal((prev) => {
      return { ...prev, isOpen: false };
    });
    carSpaceModalContext.closeModal();
  };

  return (
    <form onSubmit={formSubmitHandler} className={classes.form}>
      <CarSpaceFormSubModal
        open={subModal.isOpen}
        onClose={subModal.onClose}
        title={subModal.title}
        content={subModal.content}
      />
      <CarSpaceCardHeader
        title={"Car space registration"}
        onClose={carSpaceModalContext.closeModal}
      />
      <CarSpaceCardContent>
        <CarSpaceCardContentLeft>
          <div className={classes["image-upload-container"]}>
            <CarSpaceFormImageCarousel
              images={formState.images.value}
              onDeleteImage={imageDeleteHandler}
            />
            <div className={classes["image-uploader"]}>
              <InputField
                type="file"
                onChange={imageUploadHandler}
                multiple={true}
              />
            </div>
          </div>
          <div className={classes.actions}>
            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={!formState.isFormValid}
            >
              {isLoading ? <CircularProgress size="1.5rem" /> : "Registration"}
            </Button>
          </div>
        </CarSpaceCardContentLeft>
        <CarSpaceCardContentRight>
          <div className={classes.details}>
            <div className={classes.details__item}>
              <AccessTimeIcon className={classes.icon} fontSize="large" />
              <div className={classes.details__item__content__row}>
                <DateTimePicker
                  label="Start Date"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className={classes["date-input"]}
                      error={!formState.startDateTime.isValid}
                    />
                  )}
                  value={formState.startDateTime.value}
                  minDateTime={new Date()}
                  onChange={(newDate) => {
                    dispatchFormState({
                      type: "START_TIME_INPUT",
                      value: newDate,
                    });
                  }}
                  shouldDisableTime={(timeValue, clockType) => {
                    return clockType === "minutes" && timeValue % 15;
                  }}
                  reduceAnimations={true}
                />
                <DateTimePicker
                  label="End Date"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className={classes["date-input"]}
                      error={!formState.endDateTime.isValid}
                    />
                  )}
                  value={formState.endDateTime.value}
                  minDateTime={new Date()}
                  onChange={(newDate) => {
                    dispatchFormState({
                      type: "END_TIME_INPUT",
                      value: newDate,
                    });
                  }}
                  shouldDisableTime={(timeValue, clockType) => {
                    return clockType === "minutes" && timeValue % 15;
                  }}
                  reduceAnimations={true}
                />
              </div>
            </div>
            <div className={classes.details__item}>
              <BusinessIcon className={classes.icon} fontSize="large" />
              <div className={classes.details__item__content}>
                <div
                  className={`${classes.details__item__content__row} ${classes["input-container"]}`}
                >
                  <InputField
                    className={`${classes.input} ${classes.field}`}
                    inputClassName={classes.input}
                    label="Street Number"
                    type="number"
                    name="street"
                    value={formState.streetNumber.value}
                    onChange={streetNumberChangeHandler}
                  />
                  <InputField
                    className={classes.input}
                    inputClassName={classes.input}
                    label="Street Name"
                    type="text"
                    name="street"
                    value={formState.streetName.value}
                    onChange={streetNameChangeHandler}
                  />
                </div>
                <InputField
                  className={classes["input-container"]}
                  inputClassName={classes.input}
                  label="City"
                  type="text"
                  name="city"
                  value={formState.city.value}
                  onChange={cityChangeHandler}
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
                  />
                  <InputField
                    className={classes.input}
                    inputClassName={classes.input}
                    label="Postal Code"
                    type="number"
                    name="postcode"
                    value={formState.postcode.value}
                    onChange={postCodeChangeHandler}
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
