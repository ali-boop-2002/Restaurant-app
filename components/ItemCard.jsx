import Image from "next/image";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

function ItemCard({ admin, id, name, description, isFeatured, image }) {
  return (
    <div>
      <div className="w-full hover:cursor-pointer relative ">
        {admin && (
          <div className="absolute top-2 right-1 flex gap-2 z-10">
            <Link href={`edit-menu-item/${id}`}>
              <button className="bg-white hover:bg-gray-100 px-2 py-1 rounded text-sm shadow">
                Edit
              </button>
            </Link>
            <DeleteButton id={id} />
          </div>
        )}

        <Image
          src={image[0]}
          width="0"
          height="0"
          sizes="100vw"
          className="w-full h-50 object-cover rounded-xl"
          alt={name}
        />
      </div>
      {isFeatured && admin && (
        <div className="bg-blue-500 rounded-full text-center my-2">
          Featured Item
        </div>
      )}

      <div>{name}</div>
      <div>{description.slice(0, 30)}...</div>
    </div>
  );
}

export default ItemCard;
