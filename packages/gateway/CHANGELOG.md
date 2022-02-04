# Changelog

## 1.0.0 (2022-02-04)


### Features

* gateway add cloudflare cache layer ([#1180](https://github.com/nftstorage/nft.storage/issues/1180)) ([9fc5e67](https://github.com/nftstorage/nft.storage/commit/9fc5e6780bbe70f5d91095492a5d55c3a250be94))
* gateway logtail integration ([#1037](https://github.com/nftstorage/nft.storage/issues/1037)) ([85a82ff](https://github.com/nftstorage/nft.storage/commit/85a82ff0783399368572c158962618a41081d703))
* gateway rate limiting durable object ([#1178](https://github.com/nftstorage/nft.storage/issues/1178)) ([2b632e2](https://github.com/nftstorage/nft.storage/commit/2b632e2c7daac0f3b75a387a624d131d5ae2d092))
* gateway with x-forwarded-for ip for ipfs.io gateway ([#1227](https://github.com/nftstorage/nft.storage/issues/1227)) ([539813d](https://github.com/nftstorage/nft.storage/commit/539813d7984134fe5518dcfcfe32805f320f2809))
* nft.storage naive gateway implementation ([#908](https://github.com/nftstorage/nft.storage/issues/908)) ([119d948](https://github.com/nftstorage/nft.storage/commit/119d948681da11bcae250f19d8b3eae04e5992b4))
* sentry to gateway ([#919](https://github.com/nftstorage/nft.storage/issues/919)) ([8d544d3](https://github.com/nftstorage/nft.storage/commit/8d544d3bc5d969b2f3a5ef988b0d3c35b1092602))
* track content length histogram ([#1206](https://github.com/nftstorage/nft.storage/issues/1206)) ([8723412](https://github.com/nftstorage/nft.storage/commit/8723412b414f9c277854aeb12291f6dfd0692bf1))
* use multiple gateways and track metrics ([#961](https://github.com/nftstorage/nft.storage/issues/961)) ([24df1f6](https://github.com/nftstorage/nft.storage/commit/24df1f69d481ecb07bdbde237af837a812773e3e))


### Bug Fixes

* gateway histogram metrics ([#1124](https://github.com/nftstorage/nft.storage/issues/1124)) ([a04a616](https://github.com/nftstorage/nft.storage/commit/a04a616b3c42d5ea83494175cdf19b0cd121d5ab))
* gateway metrics track total winner successful requests ([#1122](https://github.com/nftstorage/nft.storage/issues/1122)) ([1e74ca4](https://github.com/nftstorage/nft.storage/commit/1e74ca477ab71cb37e90620312369321601c890f))
* gateway picture with project name updated ([#1170](https://github.com/nftstorage/nft.storage/issues/1170)) ([c8675e2](https://github.com/nftstorage/nft.storage/commit/c8675e27c429dce165ea741a0c78d4452b494007))
* gateway prometheus metrics best practices naming ([#1194](https://github.com/nftstorage/nft.storage/issues/1194)) ([cfb2616](https://github.com/nftstorage/nft.storage/commit/cfb2616bf9a3ef52ec50fb13b0b0095561dd7bd8))
* logtail to log request start and end ([#1118](https://github.com/nftstorage/nft.storage/issues/1118)) ([70c5afc](https://github.com/nftstorage/nft.storage/commit/70c5afca51dec29b55b1683208601e8839f0361a))
* only cache when content length smaller than max object size ([#1197](https://github.com/nftstorage/nft.storage/issues/1197)) ([8907f70](https://github.com/nftstorage/nft.storage/commit/8907f70206339582b5726e845c0cc11a83c0b867))
* prometheus histogram requires upper bound +inf ([#1162](https://github.com/nftstorage/nft.storage/issues/1162)) ([02bb41c](https://github.com/nftstorage/nft.storage/commit/02bb41c8c1b5916d8f16109e4763a1e4b8bc3900))
* properly track errors on winner gateway fetch ([#1133](https://github.com/nftstorage/nft.storage/issues/1133)) ([d989ece](https://github.com/nftstorage/nft.storage/commit/d989ecee7b212357aa88e018796b83c44951697f))
* refactor metrics durable object ([#1112](https://github.com/nftstorage/nft.storage/issues/1112)) ([4eee871](https://github.com/nftstorage/nft.storage/commit/4eee8715cbd22c6ff05ff539ecae98f01cc1c320))
* rename gateway package ([#1114](https://github.com/nftstorage/nft.storage/issues/1114)) ([1ffdced](https://github.com/nftstorage/nft.storage/commit/1ffdced29054a105e9ffc4e03ed200911162c854))
* reset durable objects migrations ([#1233](https://github.com/nftstorage/nft.storage/issues/1233)) ([34f0f75](https://github.com/nftstorage/nft.storage/commit/34f0f7542abc1a4ae2566a149d9453089fd9dbf3))
* update gateway miniflare to final version ([#1208](https://github.com/nftstorage/nft.storage/issues/1208)) ([c0b2c3e](https://github.com/nftstorage/nft.storage/commit/c0b2c3e193e3f7a932fd249c125f09508b9b9986))
