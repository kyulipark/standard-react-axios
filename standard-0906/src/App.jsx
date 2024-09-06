import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const App = () => {
  const getPosts = async () => {
    const response = await axios.get("http://localhost:4000/posts");
    return response.data;
  };

  const addPost = async (newPost) => {
    await axios.post("http://localhost:4000/posts"),
      {
        title: newPost.title,
        views: newPost.views,
      };
  };

  const addMutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      QueryClient.invalidateQueries(["posts"]);
    },
  });

  const [title, setTitle] = useState("");
  const [views, setViews] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoading) {
    return <div>로딩중입니다..</div>;
  }

  if (isError) {
    return <div>오류가 발생했습니다..</div>;
  }

  return (
    <div>
      <input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <input
        value={views}
        onChange={(e) => {
          setViews(e.target.value);
        }}
      />
      <button
        onClick={() => {
          addMutation.mutate({
            title,
            views,
          });
        }}
      >
        제출
      </button>

      {data.map((post) => {
        return <div key={post.id}>{post.title}</div>;
      })}
    </div>
  );
};

export default App;
