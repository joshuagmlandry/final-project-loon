import AddToFavourites from "./AddToFavourites";
import DisplayReviews from "./DisplayReviews";
import ErrorPage from "./ErrorPage";
import esriConfig from "@arcgis/core/config";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import ImageGallery from "react-image-gallery";
import Loading from "./Loading";
import ReviewForm from "./ReviewForm";
import styled from "styled-components";
import { FilterContext } from "./FilterContext";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "react-image-gallery/styles/css/image-gallery.css";
const { REACT_APP_ARCGIS_API } = process.env;

// Component for the individual campsite pages.

const Campsite = () => {
  const [queriedCampsite, setQueriedCampsite] = useState(null);
  const [queriedCampsiteLoading, setQueriedCampsiteLoading] =
    useState("loading");
  const [userReviews, setUserReviews] = useState([]);
  const [userReviewsLoading, setUserReviewsLoading] = useState("loading");
  const userReviewArray = [];
  const params = useParams();
  const { user, isAuthenticated } = useAuth0();
  const { postAdded } = useContext(FilterContext);

  useEffect(() => {
    // Query the feature layer for the details of the requested campsite

    esriConfig.apiKey = REACT_APP_ARCGIS_API;
    const campsites = new FeatureLayer({
      url: "https://services5.arcgis.com/07vUVKCTnBBHddyU/arcgis/rest/services/accommodation_hebergementgdb/FeatureServer/0",
    });
    const query = campsites.createQuery();
    query.where = `URL_f = '${params.id}'`;
    query.outFields = [
      // "Accommodation_Type",
      // "region_name",
      // "place_name",
      // "area_name",
      // "facility_name",
      // "unit_type_name",
      // "Unique_Site_ID",
      // "Site_Num_Site",
      "Name_e",
      "URL_f",
      "Site_Num_Site",
      "Accommodation_Type",
      "Park_Name",
      "Province",
    ];
    campsites.queryFeatures(query).then((data) => {
      setQueriedCampsiteLoading("idle");
      setQueriedCampsite(data.features[0].attributes);
    });
  }, []);

  useEffect(() => {
    // Get all user submitted reviews for the requested campsite

    if (queriedCampsiteLoading !== "loading" && queriedCampsite !== null) {
      fetch(
        `https://loon-backend.onrender.com/api/campsite-reviews/${queriedCampsite.URL_f}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            userReviewArray.push(data.data);
            setUserReviews(userReviewArray[0]);
            setUserReviewsLoading("idle");
          } else {
            setUserReviewsLoading("idle");
          }
        });
    }
  }, [queriedCampsiteLoading, postAdded]);

  return (
    // Show all campsite details, allow the logged in user to favourite the campsite, create a photo gallery from all images that were submitted with reviews, display the user submitted reviews as well as five random mock reviews, and show the review form (with CAPTCHA verification).

    <>
      {queriedCampsiteLoading !== "loading" ? (
        queriedCampsite !== null ? (
          <PageWrapper>
            <TopWrapper>
              <CampsiteWrapper>
                <MainHeader>{params.id}</MainHeader>
                <CampsiteSubHeader>Province/Territory:</CampsiteSubHeader>{" "}
                <CampsiteSubHeaderText>
                  {queriedCampsite.Province}
                </CampsiteSubHeaderText>
                <CampsiteSubHeader>Park/Location:</CampsiteSubHeader>{" "}
                <CampsiteSubHeaderText>
                  {queriedCampsite.Park_Name}
                </CampsiteSubHeaderText>
                <CampsiteSubHeader>Campground/Site:</CampsiteSubHeader>{" "}
                <CampsiteSubHeaderText>
                  {queriedCampsite.Name_e}
                </CampsiteSubHeaderText>
                <CampsiteSubHeader>Accommodation Type:</CampsiteSubHeader>{" "}
                <CampsiteSubHeaderText>
                  {queriedCampsite.Accommodation_Type}
                </CampsiteSubHeaderText>
                <CampsiteSubHeader>Site Number:</CampsiteSubHeader>{" "}
                <CampsiteSubHeaderText>
                  {queriedCampsite.Site_Num_Site}
                </CampsiteSubHeaderText>
                {isAuthenticated && (
                  <AddToFavourites
                    user={user}
                    queriedCampsite={queriedCampsite}
                  />
                )}
              </CampsiteWrapper>
              <div>
                {userReviewsLoading !== "loading" &&
                userReviews.length !== 0 ? (
                  userReviews.filter((review) => {
                    return review.media !== null;
                  }).length !== 0 ? (
                    <FeaturedWrapper>
                      <MainHeader>Photo Gallery</MainHeader>
                      <StyledImageGallery>
                        <ImageGallery
                          showPlayButton={false}
                          items={userReviews
                            .filter((review) => {
                              return review.media !== null;
                            })
                            .map((entry) => {
                              return {
                                original: entry.media.url,
                                thumbnail: entry.media.thumbnail_url,
                              };
                            })}
                        />
                      </StyledImageGallery>
                    </FeaturedWrapper>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </div>
            </TopWrapper>
            <DisplayReviews
              userReviews={userReviews}
              userReviewsLoading={userReviewsLoading}
              queriedCampsite={queriedCampsite}
            />
            <ReviewForm queriedCampsite={queriedCampsite} />
          </PageWrapper>
        ) : (
          <ErrorPage />
        )
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Campsite;

const CampsiteSubHeader = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  margin: 10px 0;
`;

const CampsiteSubHeaderText = styled.p`
  font-family: var(--font-body);
`;

const CampsiteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: var(--font-body);
  margin: 50px 50px;
  @media only screen and (min-width: 768px) {
    margin: 50px 75px;
  }
`;

const FeaturedWrapper = styled.div`
  text-align: left;
  margin: 30px 50px;
  @media only screen and (min-width: 768px) {
    margin: 50px 75px;
    text-align: right;
  }
`;

const MainHeader = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledImageGallery = styled.div`
  height: 500px;
  max-width: 300px;
`;

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media only screen and (min-width: 768px) {
    flex-direction: row;
  }
`;
