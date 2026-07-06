# Microsoft Power BI Desktop - Tourism & Hospitality Analytics Guide

This guide describes how to import `Tourism_Hospitality_Industry_Analysis.csv` into Power BI Desktop, format the data model using a Star Schema, and write DAX measures for rich reporting.

---

## Step 1: Import the CSV Data
1. Open **Power BI Desktop**.
2. Click **Get Data** > **Text/CSV**.
3. Select `Tourism_Hospitality_Industry_Analysis.csv`.
4. Click **Transform Data** to open the **Power Query Editor**.

---

## Step 2: Data Cleaning & Transformations (Power Query)
To build an optimal model, it is recommended to split the single flat CSV table into a **Star Schema** (Dimension and Fact tables):

### 1. Create Geography Dimension (`Dim_Location`)
1. Right-click the imported query and select **Reference**.
2. Rename the new query to `Dim_Location`.
3. Select `Country` and `City`. Right-click and choose **Remove Other Columns**.
4. Select both columns, right-click, and click **Remove Duplicates**.
5. Add an index column: Go to **Add Column** > **Index Column** > **From 1**. Rename this column to `LocationKey`.
6. This will be your geography reference table.

### 2. Create Date Dimension (`Dim_Date`)
1. Reference the original query again and rename it to `Dim_Date`.
2. Select `Year` and `Month`. Right-click and choose **Remove Other Columns**.
3. Remove duplicates.
4. Add a custom column to create a proper Date key or Name:
   - Go to **Add Column** > **Custom Column**.
   - Name it `MonthName` and enter the formula: `Date.MonthName(#date([Year], [Month], 1))`
5. Add an index column: **Index Column** > **From 1**. Rename to `DateKey`.

### 3. Create Hotel Info Dimension (`Dim_Hotel`)
1. Reference the original query again and rename it to `Dim_Hotel`.
2. Keep only: `Hotel_Rating`, `Average_Room_Price_USD`, `Number_of_Hotels`.
3. Remove duplicates and add an index column: `HotelKey`.

### 4. Setup Fact Table (`Fact_Tourism`)
1. In the original query (rename it to `Fact_Tourism`):
   - Merge queries with `Dim_Location` matching `Country` and `City`. Expand `LocationKey`.
   - Merge with `Dim_Date` matching `Year` and `Month`. Expand `DateKey`.
   - Merge with `Dim_Hotel` matching rating and price metrics, expand `HotelKey`.
   - Remove the original text columns: `Country`, `City`, `Year`, `Month`, `Hotel_Rating` to keep the fact table clean and lightweight.
2. Click **Close & Apply**.

---

## Step 3: Define Relationships (Model View)
In Power BI's **Model View**, drag connections between the keys:
- Connect `Dim_Location[LocationKey]` to `Fact_Tourism[LocationKey]` (1-to-many, Single direction).
- Connect `Dim_Date[DateKey]` to `Fact_Tourism[DateKey]` (1-to-many, Single direction).
- Connect `Dim_Hotel[HotelKey]` to `Fact_Tourism[HotelKey]` (1-to-many, Single direction).

This forms a standard, highly performant **Star Schema**.

---

## Step 4: Write DAX Measures
Create a new table called `_Measures` and add the following DAX calculations:

### 1. Total Tourism Revenue
```dax
Total Revenue = SUM(Fact_Tourism[Tourism_Revenue_USD])
```

### 2. Total Tourists Count
```dax
Total Tourists = SUM(Fact_Tourism[Number_of_Tourists])
```

### 3. Average Length of Stay
```dax
Avg Stay Days = AVERAGE(Fact_Tourism[Average_Length_of_Stay])
```

### 4. Average Occupancy Rate
```dax
Avg Hotel Occupancy = AVERAGE(Fact_Tourism[Hotel_Occupancy_Rate]) / 100
```

### 5. Eco-Tourism Contribution Rate
```dax
Eco-Tourism Revenue Share = 
DIVIDE(
    SUM(Fact_Tourism[Eco_Tourism_Revenue_USD]),
    [Total Revenue],
    0
)
```

### 6. Carbon Intensity (Carbon Footprint per Tourist)
```dax
Carbon Per Tourist = 
DIVIDE(
    SUM(Fact_Tourism[Carbon_Footprint_kg]),
    [Total Tourists],
    0
)
```

---

## Step 5: Visualizations Dashboard
Build the following tabs in your Power BI Report:

1. **Executive Overview Dashboard:**
   - **Cards:** `Total Revenue`, `Total Tourists`, `Avg Occupancy`, `Avg Hotel Occupancy`.
   - **Line Chart:** `Total Revenue` by Year and Month (X-axis) to analyze seasonal trends.
   - **Bar Chart:** `Total Revenue` by `Country` (Dim_Location).
   - **Donut Chart:** `Total Tourists` by `Purpose_of_Visit` (Dim_Metrics/Fact).

2. **Sustainability Analysis:**
   - **Scatter Chart:** `Carbon Footprint` (Y-axis) vs. `Eco-Tourism Revenue` (X-axis) colored by `Country`.
   - **Bar Chart:** `Waste Management Rating` by `City`.
   - **Key Metrics Table:** List of Countries, Cities, Eco-Tourism Revenue, and Carbon footprints.

3. **Hospitality Intelligence:**
   - **Bar Chart:** `Average Room Price` and `Hotel Occupancy` by `Hotel_Rating`.
   - **Line Chart:** `Tourist Satisfaction Score` compared to `Hotel Occupancy Rate`.
