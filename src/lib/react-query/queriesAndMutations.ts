import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query';
import { SavePost, createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPost, likePost, searchPosts, signInAccount, signOutAccount, updatePost } from '../appwrite/api';
import { INewPost, INewUser, IUpdatePost } from '@/types';
import { QUERY_KEYS } from './queryKeys';
 

export const useCreateUserAccountMutation = () => {
    return useMutation({
        mutationFn : (user : INewUser) => createUserAccount(user)
    })
}

export const useSignInAccountMutation = () => {
    return useMutation({
        mutationFn : (user : {
            email : string ;
             password : string ;
            }) => signInAccount(user)
    })
}

export const useSignOutAccountMutation = () => {
    return useMutation({
        mutationFn :  signOutAccount //self calling function
    })
}

export const useCreatePostMutation = () =>{
    // we also want to query the post to show them into the home page
    const queryClient = useQueryClient();

    // why to invalid ? 
    // because react query allow us  to fetch the new and fresh data


    // when we getrecentPost then it invalidate this query means it not be able to get recent post from cache rather it gonna recall it again from the server

    return useMutation({
        mutationFn : (post : INewPost) => createPost(post),
        onSuccess : () => {
            queryClient.invalidateQueries({  
                queryKey : [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}


export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPost,
    })
}



export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn : ({postId , likesArray} : {postId : string, likesArray : string[]}) => likePost(postId , likesArray),
            onSuccess :(data) =>{
                queryClient.invalidateQueries({
                    queryKey : [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
                })
                queryClient.invalidateQueries({
                    queryKey : [QUERY_KEYS.GET_RECENT_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey : [QUERY_KEYS.GET_POSTS ]
                })
                queryClient.invalidateQueries({
                    queryKey : [QUERY_KEYS.GET_CURRENT_USER ]
                })
            }
        }
    )
}

export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn : ({postId , userId} : {postId : string, userId : string}) => SavePost(postId , userId),
            onSuccess :() =>{
                
                queryClient.invalidateQueries({
                    queryKey : [QUERY_KEYS.GET_RECENT_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey : [QUERY_KEYS.GET_POSTS ]
                })
                queryClient.invalidateQueries({
                    queryKey : [QUERY_KEYS.GET_CURRENT_USER ]
                })
            }
        }
    )
}

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn : (savedRecordId : string ) => deleteSavedPost(savedRecordId),
            onSuccess :() =>{
                
                queryClient.invalidateQueries({
                    queryKey : [QUERY_KEYS.GET_RECENT_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey : [QUERY_KEYS.GET_POSTS ]
                })
                queryClient.invalidateQueries({
                    queryKey : [QUERY_KEYS.GET_CURRENT_USER ]
                })
            }
        }
    )
}

export const  useGetCurrentUser = () => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER],
        queryFn : getCurrentUser
    })
}

export const useGetPostById = (postId? : string) => {
    return useQuery({
        queryKey : [QUERY_KEYS.GET_POST_BY_ID , postId],
        queryFn : () => getPostById(postId),
        enabled : !!postId
    })
}
export const useUpdatePost = () => {

    const queryClient = useQueryClient() // use for mutation

    return useMutation({
         
        mutationFn : (post : IUpdatePost) => updatePost(post),
        onSuccess : (data) => {
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}
export const useDeletePost = () => {

    const queryClient = useQueryClient() // use for mutation

    return useMutation({
         
        mutationFn : ({postId , imageId} : {postId : string , imageId : string}) => deletePost(postId  , imageId),
        onSuccess : () => {
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_RECENT_POSTS ] //because refetching the recent post not the deleted one
            })
        }
    })
}
export const useGetPosts = () => {
    return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      queryFn: getInfinitePosts as any,
      getNextPageParam: (lastPage: any) => {
        // If there's no data, there are no more pages.
        if (lastPage && lastPage.documents.length === 0) {
          return null;
        }
  
        // Use the $id of the last document as the cursor.
        const lastId = (lastPage.documents[lastPage.documents.length - 1].$id);
        return lastId;
      },
      initialPageParam: null,
    });
  };

export const useSearchPosts = (searchTerm : string)=>{
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS,searchTerm],
        queryFn : () => searchPosts(searchTerm),
        enabled : !!searchTerm  //when it is going to automatically refetch --> when searchTerm changes
    })
}