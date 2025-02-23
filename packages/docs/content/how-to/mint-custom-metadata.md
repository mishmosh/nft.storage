---
title: Store and mint NFTs using custom metadata
---

If your metadata conforms to the popular ERC-721 or ERC-1155 standards, you can [upload all your NFT assets and prepare your metadata all in one HTTP request](./mint-erc-1155.md). 

If you want to customize your metadata in a way that's not compatible with ERC-1155, or if you know you'll be using the same off-chain assets in many NFTs, you can store your files separately and get their IPFS URIs. You can then use these IPFS URIs and put them into a JSON file however you'd like to create your metadata. This metadata can then be stored, resulting in an IPFS URI that you can store in your token's on-chain record.

:::info Check your metadata URI
It's important to make sure you are using a properly formatted IPFS URL (i.e., `ipfs://bafy...`) for the metadata URL you use when minting your NFT, as well as the URLs referenced within the metadata. This way, any IPFS-compatible browser can retrieve the right data directly using these URLs, and your NFT follows this universal standard. Click [here](https://docs.ipfs.io/how-to/address-ipfs-on-web/) to read more about IPFS URLs.
:::

Here's an example on how to do this to mint your own NFT!

## Uploading your images, assets, and metadata

Before you can create the blockchain record for your NFT, you'll need to store all of the off-chain resources that comprise the NFT "package". Once everything has been stored, you can use the IPFS URI for the metadata to link from the on-chain token to everything else.

<!-- docusaurus tabs imports -->
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="js" label="JavaScript">

### Storing asset files

The [JavaScript client library][reference-js-client] provides three methods that you can use to store arbitrary files for your NFT assets and metadata.

The [`storeBlob` method][reference-js-storeblob] accepts a single [`Blob`][mdn-blob] or [`File`][mdn-file] object and returns the CID of the uploaded file. Note that the original filename and content type information **will not** be preserved, and the CID returned by `storeBlob` will point directly to the file data.

To preserve filenames, or to upload multiple related files at once, use the [`storeDirectory` method][reference-js-storedirectory]. `storeDirectory` takes multiple `File` objects and wraps them with an IPFS directory listing. This allows you to link to the files using human-readable names as the "path" component of your IPFS URIs or gateway links.

It's important to note that `storeDirectory` returns the CID of the directory listing, and you'll need to append the filename to the CID to construct links to the files themselves.

For example, storing an image named `pinpie.jpg` using `storeDirectory` might return the CID `bafybeiajdopsmspomlrpaohtzo5sdnpknbolqjpde6huzrsejqmvijrcea`. If you [view this CID on an HTTP gateway](https://bafybeiajdopsmspomlrpaohtzo5sdnpknbolqjpde6huzrsejqmvijrcea.ipfs.dweb.link), you should see a directory listing page with a link to the file `pinpie.jpg`.

![Screenshot of IPFS directory listing containing a file named 'pinpie.jpg'](../images/gateway-dir-listing.png)

To link to the image, you'll need to add `/pinpie.jpg` to the CID to create a valid IPFS URI:

```
ipfs://bafybeiajdopsmspomlrpaohtzo5sdnpknbolqjpde6huzrsejqmvijrcea/pinpie.jpg
```

The final method for storing arbitrary data is [`storeCar`][reference-js-storecar], which stores data that has been packaged into the IPFS Content Archive format. This method gives you precise control over how the IPFS object graph is structured and may be a good fit if you already have data in IPFS. See the [CAR file guide][guide-car-files] to learn how to work with CARs and prepare them for upload.

### Preparing your metadata

Once you have all of your assets stored, you can update your metadata to include IPFS URIs to the images and other files that are part of your NFT.

For each file that you uploaded, prepare an IPFS URI of the form `ipfs://<CID>` for files stored with `storeBlob`, or `ipfs://<DirectoryCID>/<filename>` for files stored with `storeDirectory`. 

In some cases you may also want to include HTTP gateway URLs, but it's best to add those as an optimization or fallback for compatibility with browsers or wallets that don't support IPFS natively. See [the IPFS documentation about web addresses](https://docs.ipfs.io/how-to/address-ipfs-on-web/) for more details on IPFS URIs and the tradeoffs involved in using HTTP gateways.

Once the metadata is ready, you can serialize it to a file (usually in JSON format), and upload it using `storeBlob` or `storeDirectory`. That will give you a CID you can use to link to the metadata from your on-chain NFT record.

</TabItem>

<TabItem value="http" label="HTTP API">

### Storing asset files

The [HTTP API][reference-http-api] provides a `/upload` endpoint that accepts one or more files and stores them with NFT.Storage.

:::info Size limits
The `/upload` endpoint can accept up to 100 MiB in each HTTP request. If your files are larger than 100 MiB, see the section below on [CAR files](#car-files), which can be used to split uploads between several HTTP requests.
:::

#### Single file

To upload a single file, send a `POST` request to `/upload` with the binary file data as the request body. The `Content-Type` header should be set to a type that's appropriate for the content, for example, `image/jpeg`.

You should get a response similar to this one:

```json
{
  "ok": true,
  "value": {
    "cid": "bafkreidivzimqfqtoqxkrpge6bjyhlvxqs3rhe73owtmdulaxr5do5in7u",
    "size": 132614,
    "created": "2021-03-12T17:03:07.787Z",
    "type": "image/jpeg",
    "scope": "default",
    "pin": {
      "cid": "bafkreidivzimqfqtoqxkrpge6bjyhlvxqs3rhe73owtmdulaxr5do5in7u",
      "name": "pin name",
      "meta": {},
      "status": "queued",
      "created": "2021-03-12T17:03:07.787Z",
      "size": 132614
    },
    "files": [
      {
        "name": "logo.jpg",
        "type": "image/jpeg"
      }
    ],
    "deals": [
      {
        "batchRootCid": "bafkreidivzimqfqtoqxkrpge6bjyhlvxqs3rhe73owtmdulaxr5do5in7u",
        "lastChange": "2021-03-18T11:46:50.000Z",
        "miner": "f05678",
        "network": "nerpanet",
        "pieceCid": "bafkreidivzimqfqtoqxkrpge6bjyhlvxqs3rhe73owtmdulaxr5do5in7u",
        "status": "queued",
        "statusText": "miner rejected my data",
        "chainDealID": 138,
        "dealActivation": "2021-03-18T11:46:50.000Z",
        "dealExpiration": "2021-03-18T11:46:50.000Z"
      }
    ]
  }
}
```

#### Multiple files

To upload multiple files, send a `POST` request to `/upload` containing multi-part [`FormData`][mdn-formdata] in the request body. The `Content-Type` header must be set to `multipart/form-data`. 

Each "part" of the multi-part form data should include a `Content-Disposition` header, which specifies the name of the form field (always `"file"`), and the filename. The part header should also include a `Content-Type` header with a value appropriate for the data being uploaded.

Here's an example:

```
------WebKitFormBoundary5peilISl2YOOweQy
Content-Disposition: form-data; name="file"; filename="image.png"
Content-Type: image/png

<data>
------WebKitFormBoundary5peilISl2YOOweQy--
```

The `------WebKitFormBoundary5peilISl2YOOweQy` tokens in the example above set the boundary of each "part" within the form data. In most cases, this will be set automatically by whatever request library or API is preparing the form data body. If you're preparing multi-part requests manually, see [RFC7578](https://datatracker.ietf.org/doc/html/rfc7578).

#### CAR files

The `/upload` endpoint has some special support for IPFS Content Archives (CARs) that can be used to upload files larger than the 100 MiB single-request limit. 

Uploading CAR files works just like uploading a single file. Send a `POST` request to `/upload`, with the `Content-Type` header set to `application/car` and the binary file data as the request body.

To upload files larger than 100 MiB, you can pack them into a CAR file and split the CAR into chunks, uploading each chunk in a separate HTTP request. See the [CAR file guide][guide-car-files] to learn more.

### Preparing your metadata

Once you have all of your assets stored, you can update your metadata to include IPFS URIs to the images and other files that are part of your NFT.

For each file that you uploaded, prepare an IPFS URI of the form `ipfs://<CID>/<filename>`.

In some cases you may also want to include HTTP gateway URLs, but it's best to add those as an optimization or fallback for compatibility with browsers or wallets that don't support IPFS natively. See [the IPFS documentation about web addresses](https://docs.ipfs.io/how-to/address-ipfs-on-web/) for more details on IPFS URIs and the tradeoffs involved in using HTTP gateways.

Once the metadata is ready, you can serialize it to a file (usually in JSON format), and upload it by sending a `POST` request to `/upload` with the metadata as the request body. Set the `Content-Type` header to the type appropriate for your metadata, e.g. `application/json`.

You can use the CID from your metadata upload to link from your on-chain record to the metadata on IPFS.

</TabItem>
</Tabs>


:::info Need to use CIDv0?
There are two versions of IPFS Content Identifiers (CIDs) in use today. The legacy "CIDv0" format is more compact, but it lacks several important features of CIDv1 and is generally discouraged for new projects.

If you need to work with a system that only supports CIDv0 (for example, because of a hard size constraint in a smart contract), you can prepare a CAR file containing IPFS objects that are compatible with CIDv0. The NFT.Storage APIs will still return a CIDv1 result, but this can be converted to CIDv0 using the CID tooling for your programming language.

<!-- TODO: update link after PR is merged (link to example source code) -->
See [this pull request](https://github.com/nftstorage/nft.storage/pull/991) for an example.
:::


## Minting your NFT

Coming soon...

<!-- TODO: add minting example. Maybe extract from NFT school Flow tutorial? -->

[guide-car-files]: ../concepts/car-files.md

[reference-http-api]: https://nft.storage/api-docs/
[reference-js-client]: https://nftstorage.github.io/nft.storage/client
[reference-js-storeblob]: https://nftstorage.github.io/nft.storage/client/classes/lib.NFTStorage.html#storeBlob
[reference-js-storedirectory]: https://nftstorage.github.io/nft.storage/client/classes/lib.NFTStorage.html#storeDirectory
[reference-js-storecar]: https://nftstorage.github.io/nft.storage/client/classes/lib.NFTStorage.html#storeCar

[mdn-file]: https://developer.mozilla.org/en-US/docs/Web/API/File
[mdn-blob]: https://developer.mozilla.org/en-US/docs/Web/API/Blob
[mdn-formdata]: https://developer.mozilla.org/en-US/docs/Web/API/FormData