import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { FlickrPhotoSize } from "@/types/apiResponse";

//https://www.flickr.com/photos/128667930@N07/15860501205/in/photolist-2msaQu4-2iXoDzS-2ngPUgM-rxte6s-2iVxzUE-2mjDZLg-y5cAWx-ZD3ejs-JS29fu-DTAcTf-KGJ5SY-JEjmys-qaxdrk-2kVGKjz-2h7QVdH-Hxg2zE-2nZU9Bv-SRx6FS-D8SVE1-H6q9T9-RQHtWK-kgpSxa-Z9TGrE-JYKxG5-mrKLLx-2gkdNT9-h669fV-zZsKct-RQHttF-2h9zQQb-W5ozoQ-27nmcN5-2j9nEJN-2oxP1fM-2h7QVxq-QuhJG7-ZgSLdD-zWUbCA-LeVTxS-Jdfcqz-TJ4eVU-DEUKCD-2388Np9-5vByuM-q279cE-qScA2w-2cFBbBY-Gsu9wX-2h7TttK-2kL3sCx

export async function POST(req: NextRequest) {
  const { photoId } = await req.json();

  if (!photoId) {
    return NextResponse.json(
      { error: "Photo ID is required" },
      { status: 400 }
    );
  }

  if (!process.env.FLICKR_API_KEY) {
    return NextResponse.json(
      { error: "Flickr API key is not set" },
      { status: 500 }
    );
  }

  try {
    const res = await axios.get(
      `https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${process.env.FLICKR_API_KEY}&photo_id=${photoId}&format=json&nojsoncallback=1`
    );

    if (res.status !== 200 || !res.data?.sizes?.size) {
      throw new Error("Failed to fetch photo sizes from Flickr");
    }

    const image = res.data.sizes.size.find(
      (s: FlickrPhotoSize) => s.label === "Medium 640"
    );

    if (!image) {
      return NextResponse.json(
        { error: "No suitable photo size found" },
        { status: 404 }
      );
    }

    const source = image.source;
    const url = image.url;

    if (!source) {
      return NextResponse.json(
        { error: "No suitable photo size found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        photo: {
          source: source,
          url: url,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch photo sizes from Flickr" },
      { status: 500 }
    );
  }
}
