import { useState } from "react";
import Upload from "../components/Upload";
import ImageList from "../components/ImageList";

const UploadPage = () => {
    const [images, setImages] = useState([]);
    return (
        <div className="p-6 flex flex-col items-center">
            <Upload onUpload={(img) => setImages([...images, img])} />
            <ImageList images={images} />
        </div>
    );
};

export default UploadPage;
