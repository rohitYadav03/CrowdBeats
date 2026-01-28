import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){

const session = await auth.api.getSession(({
    headers : await headers()
}));

if(!session){
    return NextResponse.json({
        success : false,
        message : "Unauthorized"
    }, { status : 401})
}

const serchParams = req.nextUrl.searchParams;
const search = serchParams.get("q");

if(!search){
    return NextResponse.json({
        success : false,
        message : "No input text found"
    }, { status : 400})
}

try {
    const query = encodeURIComponent(search)
const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${process.env.API_KEY}&q=${query}&type=video&maxResults=5`, { method : "GET"})

if(!response.ok){
 throw new Error("Something went wrong") 
}

const data = await response.json();

return NextResponse.json({
    success : true,
    message : " Data fetch succesfully",
    data : data
} , { status : 200})

} catch (error) {
    return NextResponse.json({
        success : false,
        message : "Something went wrong"
    } , { status : 500})
}
   
}