package main

import (
  "net/http"
  "encoding/json"
  "bytes"
  "os"
  "fmt"
  "io/ioutil"
  "crypto/sha256"
  "encoding/hex"
  "log"
)

var API_URL string = os.Getenv("API_URL")
var PHONE string = os.Getenv("PHONE")

var transactionID string
var token string

func generateOTP() {

  body, _ := json.Marshal(map[string]string{
      "mobile":  PHONE,
   })
  encodedBody := bytes.NewBuffer(body)
  resp, err := http.Post(API_URL + "/v2/auth/public/generateOTP", "application/json", encodedBody)
  if err != nil {
    fmt.Println("An error occured while calling generateOTP")
    panic(err)
  }
  defer resp.Body.Close()
  readBody, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    fmt.Println("An error occured while reading the response of generateOTP")
    panic(err)
  }
  var decodedResp map[string]string
  json.Unmarshal(readBody, &decodedResp)
  transactionID = decodedResp["txnId"]
  fmt.Println("Transaction ID:", transactionID)
}

func confirmOTP(otp string) {
  body, _ := json.Marshal(map[string]string{
      "otp":  encodeOTP(otp),
      "txnId": transactionID,
   })
  encodedBody := bytes.NewBuffer(body)
  resp, err := http.Post(API_URL + "/v2/auth/public/confirmOTP", "application/json", encodedBody)
  if err != nil {
    fmt.Println("An error occured while calling confirmOTP")
    panic(err)
  }
  defer resp.Body.Close()
  readBody, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    fmt.Println("An error occured while reading the response of confirmOTP")
    panic(err)
  }
  var decodedResp map[string]string
  json.Unmarshal(readBody, &decodedResp)
  token = decodedResp["token"]
  fmt.Println("Authentication successful. Token:", token, decodedResp)
}

func encodeOTP(otp string) string {
  sum := sha256.Sum256([]byte(otp))
  return hex.EncodeToString(sum[:])
}

func calendarByDistrict(districtID string, date string) {
  params := "?district_id=" + districtID + "&date=" + date + "&Accept-Language=en_US"
  req, err := http.NewRequest("GET", API_URL + "/v2/appointment/sessions/public/calendarByDistrict" + params, nil)
  bearer := "Bearer " + token
  req.Header.Add("Authorization", bearer)
  client := &http.Client{}
  resp, err := client.Do(req)
  if err != nil {
    log.Println("Error on response.\n[ERROR] -", err)
  }
  defer resp.Body.Close()
  body, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    log.Println("Error while reading the response bytes:", err)
  }
  log.Println(string([]byte(body)))
  var response CalendarResponse
  json.Unmarshal(body, &response)
  fmt.Println(response)
  centers := response.Centers
  for _, center := range centers {
    if (center.sessions != nil) {
      for _, session := range center.sessions {
        if (session.MinAgeLimit >= 18 && session.AvailableCapacity > 0) {
          fmt.Printf("%s slot available at %s", session.AvailableCapacity, center.Name)
          fmt.Printf("More details about the center: %+v\n", center)
        }
      }
    }
  }
}

type Session struct {
  SessionID int32 `json:"session_id"`
  Date string `json:"date"`
  AvailableCapacity int32 `json:"available_capacity"`
  MinAgeLimit int32 `json:"min_age_limit"`
  Vaccine string `json:"vaccine"`
  Slots []string `json:"slots"`
}



type Centers struct {
  CenterID int32 `json:"center_id"`
  Name string `json:"name"`
  Address string `json:"address"`
  StateName string `json:"state_name"`
  DistrictName string `json:"district_name"`
  BlockName string `json:"block_name"`
  Pincode string `json:"pincode"`
  Lat string `json:"lat"`
  Long string `json:"long"`
  From string `json:"from"`
  To string `json:"to"`
  FeeType string `json:"fee_type"`
  sessions []Session `json:"sessions"`
}

type CalendarResponse struct {
  Centers []Centers `json:"centers"`
}

func main() {
  generateOTP()
  fmt.Println("Please enter the OTP received on your phone:")
  var otp string
  fmt.Scanln(&otp)
  confirmOTP(otp)
  var districtID string
  var date string
  fmt.Println("Please enter the district ID:")
  fmt.Scanln(&districtID)
  fmt.Println("Please enter the starting date of the week you want to check for:")
  fmt.Scanln(&date)
  calendarByDistrict(districtID, date)
}
