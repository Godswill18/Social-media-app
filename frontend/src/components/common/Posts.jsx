import React, { useEffect } from 'react'
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton.jsx";
// import { POSTS } from "../../utils/db/dummy";
import { useQuery } from '@tanstack/react-query';

const Posts = ({feedType, username, userId}) => {
	// const isLoading = false;

	const getPostEndPoint = () => {
		switch(feedType) {
			case "forYou":
				return "http://localhost:5000/api/posts/all";
			case "following":
				return "http://localhost:5000/api/posts/following";
			case "posts":
				return `http://localhost:5000/api/posts/user/${username}`;
			case "likes":
				return `http://localhost:5000/api/posts/likes/${userId}`;
			default:
				return "http://localhost:5000/api/posts/all";
		}
	}

	const POST_ENDPOINT = getPostEndPoint();

	const {data:posts, isLoading, refetch, isRefetching} = useQuery({
		queryKey: ["posts"], queryFn: async () => {
			try{
				const res = await fetch(POST_ENDPOINT, {
					credentials: "include", // Include cookies in the request to maintain session
					headers: {
						"Content-Type": "application/json"
					}
				});

				if(!res.ok) {
					throw new Error( data.error || "Failed to fetch posts");
				}

				const data = await res.json();
				return data;

			}catch(error) {
				console.error(error);
				throw new Error(error);
			}
		}
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch, username]);

	return (
		<>
			{isLoading || isRefetching && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{/* {console.log("Posts:", posts)} */}
					{posts.map((post) => (
						// console.log("Postkiikiikk:", post),
						// {console.log(post._id, post)}
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;