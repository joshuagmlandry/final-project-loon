import { useContext, useEffect, useState } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import esriConfig from "@arcgis/core/config";
import styled from "styled-components";
import { FilterContext } from "./FilterContext";
import { useNavigate } from "react-router-dom";
const { REACT_APP_ARCGIS_API } = process.env;

const Browse = () => {

  const [coord, setCoord] = useState([-101.674656, 57.951146]);
  const [zoom, setZoom] = useState(3);

  const {provinces, provincesLoading} = useContext(FilterContext);

  const changeHandler = (e)=>{
    if (provincesLoading !== "loading"){
      const selectedProvince = provinces.data.filter(province => {
        return province.name === e.target.value;
      });
      setCoord(selectedProvince[0].coord);
      setZoom(selectedProvince[0].zoom);      
    }
  }

  useEffect(() => {
    esriConfig.apiKey = REACT_APP_ARCGIS_API;

    const map = new Map({
      basemap: "arcgis-topographic",
    });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: coord,
      zoom: zoom,
    });

    const popupCampsites = {
      "title": "Campsites",
      "content": `<b>Accommodation Type:</b> {Accommodation_Type}<br><b>Test:</b><a href='http://www.google.com'>${zoom}</a><br>`
    }

    const campsites = new FeatureLayer({
        // url: "https://services2.arcgis.com/wCOMu5IS7YdSyPNx/ArcGIS/rest/services/Accommodation_Hebergement_V2_2/FeatureServer/0",
        url: "https://services2.arcgis.com/wCOMu5IS7YdSyPNx/ArcGIS/rest/services/Campsites_Join/FeatureServer/0",
        outFields: ["Accommodation_Type"],
        popupTemplate: popupCampsites
    });

    map.add(campsites);
  }, [coord, zoom, provincesLoading]);

  return (
    <>
    {provincesLoading !== "loading" ? (
    <Wrapper>
      <TextHeader>Browse <Bold>all campsites</Bold> or filter by <Bold>park or province</Bold></TextHeader>
      <MapAndFilter>
        <MapContainer id="viewDiv"></MapContainer>
        <Filter>
          <form onChange={changeHandler}>
            <label>Province: </label>
            <StyledSelect defaultValue={'blank'}>
              <option disabled value="blank"></option>
              {provinces.data.map((province, index) => {
                return (<option key={`${index}${province.name}`}>{province.name}</option>);
              })}
            </StyledSelect>
          </form>
        </Filter>
      </MapAndFilter>
    </Wrapper>      
    ) : " "}    
    </>
  );
};

export default Browse;

const Bold = styled.span`
  font-weight: bold;
`;

const Filter = styled.div`
  font-family: var(--font-body);
  font-size: 1.5rem;
  margin: 40px;
`;

const MapAndFilter = styled.div`
  display: flex;
  justify-content: center;
`;

const MapContainer = styled.div`
  border: 3px solid var(--color-dark-green);
  border-radius: 4px;
  padding: 0;
  margin-bottom: 50px;
  height: 500px;
  width: 900px;
`;

const StyledSelect = styled.select`
  font-family: var(--font-body);
  font-size: 1.25rem;
`;

const TextHeader = styled.div`
  font-family: var(--font-body);
  font-size: 2rem;
  margin: 40px;
`;

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
