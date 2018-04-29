Using nodejs and socket-io-client to stream live crypto transactions from Insight API.
Outputs json for every transaction in the format 
`{"time": "Sun Apr 29 2018 20:47:55 GMT+0800 (AWST)", "coin": "BTC", "txid": "f80553fab0b0610f0fab36eb3a87997583d94c79f9ff7e799a37032d608a414b"},`

And tx/s (5 min average) for all connected coins (individually and combined) every 15 seconds in the format 
`{"class": "BTC", "x": "1525010430650", "y": "0.8841463414634146"},`
`{"class": "Global", "x": "1525010280889", "y": "1.4"},`

## tx_stream
shows transactions per second (averaged over 5 minutes) for BTC, BCH, LTC, DASH, KMD and ZEC

![image](https://user-images.githubusercontent.com/35845239/39395443-1ca9c646-4b11-11e8-9386-54981e592f8a.png)


## tscl_stream 
shows transactions per second (averaged over 5 minutes) for Asset Chains

![image](https://user-images.githubusercontent.com/35845239/39395490-b1d23410-4b11-11e8-8d34-4bc1a52684f2.png)


## combined stream
shows transactions per second (averaged over 5 minutes) for Asset Chains with BTC, BCH, LTC, DASH, KMD and ZEC.

![image](https://user-images.githubusercontent.com/35845239/39395535-45515c8e-4b12-11e8-8a02-42b02b9b7cb4.png)
