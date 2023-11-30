import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


// {photos: Array(10), photoscount: 197} 



const getPhotos = async ({ pageParam = 0 }) => {
    console.log(pageParam, 'startindex tracking');
    const res = await fetch(`https://fithub-server-eta.vercel.app/image?limit=12&offset=${pageParam}`);
    const photos = await res.json();
    // console.log(photos, 'response photos');
    // const data = {
    //     photos: photos,
    //     photosCount: 50
    // }
    // console.log('photos,', data);
    return { ...photos, prevStartIndex: pageParam }
}

const ImageGalary = () => {

    // https://fithub-server-eta.vercel.app/image?limit=5&offset=3
    const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
        queryKey: ["photos"],
        queryFn: getPhotos,
        getNextPageParam: (lastPage) => {
            if (lastPage.prevStartIndex + 12 > lastPage?.photosCount) {
                return false;
            }
            return lastPage.prevStartIndex + 12;
        }
    })


    // console.log('important, data below query fn', data);

    const photos = data?.pages?.reduce((photos, page) => {
        // console.log(photos, page, 'photos inside photos');
        // console.log(photos);
        return [...photos, ...page.photos]
    }, [])

    // console.log('loaded photos belows phoo', photos);



    return (
        <div className='w-[90%] mx-auto'>
            <h2>Photo galary</h2>

            {/* // infinitty loading */}
            <div>
                <InfiniteScroll
                    dataLength={photos ? photos.length : 0}
                    next={() => fetchNextPage()}
                    hasMore={hasNextPage}
                    loading={<Skeleton count={6} />}
                >
                    <div className="w-11/12 mx-auto grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 my-10">
                        {isLoading && photos?.length === 0 ? (
                            // Show skeleton when loading and no photos are available
                            <Skeleton count={6} />
                        ) : (
                            photos?.map((photo, idx) => {
                                return (
                                    <div key={idx} className='grid grid-cols-1'>
                                        {/* <p className='bg-black rounded-full text-white'>{idx+1}</p> */}
                                        <img className='h-[300px] w-[300px] object-cover' src={photo?.url} alt="image loading" />
                                    </div>
                                );
                            })
                        )}
                    </div>


                </InfiniteScroll>
            </div>
        </div>
    );
};

export default ImageGalary;