# Data Pathways to Healthy Cities

### Project Live link and API endpoints :
1. [Our Project : LumiLess by Stellar Innovators DIU](https://stellar-innovators-nasa-space-app-2.vercel.app/)

2. [API](https://light-pollution-visualizer.duckdns.org/ml_model_pred/predict)

## Team Name
**Stellar Innovators DIU**

## Team Members
- MD. Rasel Islam ( Team Leader & Researcher )  
- MD. Shihab Shariar ( Back-end & ML models Developer ) 
- Md. Ikhtear  (Back-end Developer) 
- Fardhin Kamal ( Front-end Developer) 
- Maheer Alam ( UI/XI & video editor)  
- Sumaiya Akter ( Researcher) 

## Problem & Challenge Statement
Urban planners need actionable tools to balance city growth with environmental and human wellbeing. Our project demonstrates how NASA Earth observation data can be used to support smart, nature-based urban planning decisions for Bangladesh divisions.

## NASA Data Usage & Collection
We use NASA Earth observation datasets as follows:
- Night light intensity for urbanization proxy 
    - VIIRS DNB dataset, Datasource Name: NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG
    Satellite: Suomi National Polar-orbiting Partnership (Suomi NPP) – VIIRS instrument

- NDVI (vegetation index) for green cover analysis 
    - Datasource Name: LANDSAT/LC08/C02/T1_L2
    Satellite: Landsat 8

- Population density for demographic context 
    - Datasource Name: WorldPop/GP/100m/pop
    Satellite: Derived from multiple sources, including satellite imagery and census data (not a single satellite)

- Area co-ordinate and shape data from  
    - Datasource Name: FAO/GAUL/2015/level1
    Provider: Food and Agriculture Organization (FAO), Global Administrative Unit Layers (GAUL), served via Google Earth Engine

All data is processed and used for model training and prediction as documented in our Colab notebook and backend code.

## Solution & Demo of the Solution
Our solution consists of:

1. *Data Collection & Preparation*
	- Collected NDVI, night light intensity, and population density data for Bangladesh divisions (see ml model and dataset/).
	- Merged and processed data in the Colab notebook (google colab model building file/NASA_SpaceApp_model_building.ipynb).

	***NB : Here we took help from Gemini AI for debugging and model testing part***

2. *Model Training*
	- Trained machine learning models (Random Forest, Multioutput Regressor, RandomForestClassifier) in Colab.
	- Exported models as .joblib files (ml model and dataset/models/).

3. *Backend Integration*
	- Django backend (NASA_space_app/) with API endpoints to receive data, load pretrained models, and return predictions.
	- Models and processed data are stored in NASA_space_app/data/.
	- Our RandomForestRegressor and RandomForestClassifier both trained model was implemented inside (NASA_space_app/ml_model_pred/).
	- We used Huggingface API endpoint to use a llm named Mistral AI to provide suggestions based on predicted data. It is implemented inside (NASA_space_app/llm_suggestion/)

	***NB : Here we took help from ChatGPT AI for debugging , testing API endpoints and model rendering parts***

4. *Frontend Interaction*
	- Backend APIs receive scenario data from frontend, run predictions, and send results for visualization (e.g., plotting on maps).

## Project Structure
- google colab model building file/: Google Colab .ipynb file for data processing and model training
- ml model and dataset/: Raw and processed datasets, pretrained ML models
- NASA_space_app/: Django backend with API endpoints for prediction
- Frontend/stellar_innovators_nasa_space_app_2025-main/ : all design and API data processing works

## How to Run
1. Clone the repository
2. Install dependencies from NASA_space_app/requirements.txt
3. Place pretrained model files in NASA_space_app/data/
4. Start the Django server
5. Use API endpoints to send scenario data and receive predictions

## Our Project limitations & justifications
1. We took a very less amount of data to train the RandomForestRegressor and RandomForestClassifier and for that our models has less stability for prediction.

2. We got 2017 to 2020 population data from the valid sources and for using with the other related data we scaled up the population density data by a statistical method named linear regression to get data from 2021 to 2024.

3. Sometime our API fails to load data for some future years or locations due to cheap hosting or other technical we may not know.

4. We took 2017 to 2024 annual average data because of limited time and monthly or daily data was not available for some parameters . As well as we do not have high configuration machines to process those heavy sized data.

5. We are totally beginner in the field of machine learning and web development that is why we took several help from the modern AI like ChatGPT, Gemini. 

## Contact
For questions or demo requests, contact shihabshahriar543@gmail.com