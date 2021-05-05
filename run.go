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
)

var API_URL string = os.Getenv("API_URL")
var PHONE string = os.Getenv("PHONE")

var transactionID string = "94b3e116-cd80-41de-b591-37a673d0e83c"
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

func main() {
  generateOTP()
  fmt.Println("Please enter the OTP received on your phone:")
  var otp string
  fmt.Scanln(&otp)
  confirmOTP(otp)
}
