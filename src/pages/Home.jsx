import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const getArticles = async ({ pageParam = 0 }) => {
    const res = await fetch(`https://api.realworld.io/api/articles?limit=10&offset=${pageParam}`);
    const data = await res.json();

    return { ...data, prevOffset: pageParam }
}


const Home = () => {


    // console.log(useInfiniteQuery());

    const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
        queryKey: ["articles"],
        queryFn: getArticles,
        getNextPageParam: (lastPage) => {
            if (lastPage.prevOffset + 10 > lastPage.articlesCount) {
                return false;
            }
            return lastPage.prevOffset + 10;
        }
    })


    const articles = data?.pages.reduce((acc, page) => {
        return [...acc, ...page.articles]
    }, [])


    return (
        <div>
            <InfiniteScroll
                dataLength={articles ? articles.length : 0}
                next={() => fetchNextPage()}
                hasMore={hasNextPage}
                loading={<Skeleton count={6} />}
            >
                <div className="w-11/12 mx-auto grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 my-10">
                    {isLoading && articles?.length === 0 ? (
                        // Show skeleton when loading and no articles are available
                        <Skeleton count={6} />
                    ) : (
                        articles?.map((article, idx) => {
                            return (
                                <div className='border-2 p-2 bg-slate-200 rounded' key={idx}>
                                    <p className="text-2xl font-semibold bg-black flex justify-center items-center w-10 h-10 rounded-full text-white">{idx + 1}</p>
                                    <h3>{isLoading ? <Skeleton width={200} /> : article.description}</h3>
                                </div>
                            );
                        })
                    )}
                </div>


            </InfiniteScroll>
        </div>
    );
};

export default Home;
