import React, { useEffect, useState } from "react";
import { api } from "../api";

const BlogList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get("/posts");
                setPosts(res.data);
            } catch (err) {
                console.error("Lỗi khi lấy bài viết", err);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div>
            <h2>Danh sách bài viết</h2>
            <ul>
                {posts.map((post) => (
                    <li key={post._id}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <p><b>Thể loại:</b> {post.category}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BlogList;
