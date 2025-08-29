'use client'

import Link from "next/link";
import { useState } from "react";
import ReviewForm from "./review-form";
import { Review } from "types";

const ReviewList = ({
  userId,
  productId,
  productSlug
}: {
  userId: string;
  productId: string;
  productSlug: string
}) => {
  const  [reviews, setReviews] = useState<Review[]>([]);
  const reload = async()=> {
    console.log('review submitted')
  }

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <>{/*Review Form here */}</>
      ): (
        <div>
          Please {' '}
          <Link
          className="text-primary px-2"
          href={`/api/auth/signin?callbackurl=/product/${productSlug}`}>
          sign in
          </Link>{' '}
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">
        <ReviewForm userId={userId} productId={productId}  onReviewSubmitted={reload}  />
      </div>
    </div>
  )

};

export default ReviewList

