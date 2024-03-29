import Loading from "./Loading";
import styled from "styled-components";
import { FilterContext } from "./FilterContext";
import { useContext } from "react";

// Shows a random park, description, and mock review for the selected province

const FeaturedProvince = ({ prov, index }) => {
  const {
    allReviews,
    allReviewsLoading,
    parkDescriptions,
    parkDescriptionsLoading,
  } = useContext(FilterContext);

  const ratingToStars = (review) => {
    let starRating = "";
    switch (review.rating) {
      case 1:
        starRating = "⭐";
        return starRating;
      case 2:
        starRating = "⭐⭐";
        return starRating;
      case 3:
        starRating = "⭐⭐⭐";
        return starRating;
      case 4:
        starRating = "⭐⭐⭐⭐";
        return starRating;
      case 5:
        starRating = "⭐⭐⭐⭐⭐";
        return starRating;
      default:
        break;
    }
  };

  if (
    prov.place.length !== 0 &&
    parkDescriptionsLoading !== "loading" &&
    allReviewsLoading !== "loading"
  ) {
    const randomFeaturedPlace = prov.place[index];
    const matchedParkInfo = parkDescriptions.filter((park) => {
      return park.name === randomFeaturedPlace;
    })[0];
    const randomReview = allReviews[Math.floor(1000 * Math.random())];
    return (
      <FeatureWrapper>
        <div>
          {parkDescriptionsLoading !== "loading" ? (
            <FeaturedPark>
              <FeaturedParkLink
                target={"_blank"}
                href={matchedParkInfo.parksCanLink}
              >
                {randomFeaturedPlace}
              </FeaturedParkLink>
              <FeaturedParkImg
                src={matchedParkInfo.imgSrc}
                alt={`Image of ${randomFeaturedPlace}`}
              />
              <FeaturedParkDescription>
                {matchedParkInfo.description}
              </FeaturedParkDescription>
            </FeaturedPark>
          ) : (
            <Loading />
          )}
        </div>
        <div>
          {allReviewsLoading !== "loading" ? (
            <FeaturedPark>
              <FeaturedParkHeader>Top Review</FeaturedParkHeader>
              <ReviewTitle>{randomReview.title}</ReviewTitle>
              <ReviewRating>{ratingToStars(randomReview)}</ReviewRating>
              <ReviewAuthor>
                by <Bold>{randomReview.name}</Bold> ({randomReview.time})
              </ReviewAuthor>
              <ReviewBody>{randomReview.review}</ReviewBody>
            </FeaturedPark>
          ) : (
            <Loading />
          )}
        </div>
      </FeatureWrapper>
    );
  } else {
    if (
      parkDescriptionsLoading !== "loading" &&
      allReviewsLoading !== "loading"
    ) {
      return "";
    } else {
      return <Loading />;
    }
  }
};

export default FeaturedProvince;

const Bold = styled.span`
  font-weight: bold;
`;

const FeaturedPark = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  width: 500px;
  @media only screen and (min-width: 768px) {
    align-items: flex-start;
  }
`;

const FeaturedParkDescription = styled.div`
  font-family: var(--font-body);
  text-align: center;
  width: 300px;
  @media only screen and (min-width: 768px) {
    text-align: left;
    width: 600px;
  }
`;

const FeaturedParkHeader = styled.div`
  font-family: var(--font-body);
  font-size: 1.25rem;
  font-weight: bold;
  margin: 10px 0;
  @media only screen and (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const FeaturedParkImg = styled.img`
  border: 2px solid var(--color-dark-green);
  border-radius: 2px;
  height: 90px;
  margin: 10px 0;
  width: 180px;
`;

const FeaturedParkLink = styled.a`
  color: black;
  font-family: var(--font-body);
  font-size: 1.25rem;
  font-weight: bold;
  margin: 10px 0;
  text-decoration: none;
  &:hover {
    color: var(--color-green);
    cursor: pointer;
  }
  @media only screen and (min-width: 768px) {
    font-size: 1.5rem;
    text-align: left;
    width: 600px;
  }
`;

const FeatureWrapper = styled.div`
  border-radius: 4px;
  height: 550px;
  padding: 20px 40px 10px;
`;

const NoCampsites = styled.div`
  font-family: var(--font-body);
  font-size: 2.5rem;
  text-align: justify;
  width: 500px;
`;

const ReviewAuthor = styled.div`
  margin: 5px 0;
  text-align: center;
  width: 300px;
`;

const ReviewBody = styled.div`
  margin: 10px 0;
  text-align: center;
  width: 300px;
  word-wrap: break-word;
`;

const ReviewRating = styled.div`
  margin: 5px 0;
`;

const ReviewTitle = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 10px;
  text-align: center;
  width: 300px;
`;
