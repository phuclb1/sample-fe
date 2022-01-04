import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

const UploadComponent = ({ multiple = false, height = 345, inputData, onSelectedFileChange, isUploadFile = true, isAudio = false, bbox, showRemove = true, ...rest }) => {
    const [targetSrc, setTargetSrc] = useState(null);

    useEffect(() => {
        setTargetSrc(inputData)
    }, [inputData])

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: !isAudio ? 'image/*' : 'audio/*',
        multiple: multiple,
        onDrop: files => {
            if (multiple) {
                readmultifiles(files, (res) => {
                    onSelectedFileChange(res);
                    setTargetSrc(res);
                });
            } else {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (isUploadFile) {
                        onSelectedFileChange(files[0]);
                    } else {
                        onSelectedFileChange(e.target.result);
                    }
                    setTargetSrc(e.target.result);
                };
                reader.readAsDataURL(files[0]);
            }
        }
    });

    const readmultifiles = (files, onSuccess) => {
        let reader = new FileReader();
        let result = [];
        const readFile = (index) => {
            if (index >= files.length) return onSuccess(result);
            const file = files[index];
            reader.onload = (e) => {
                result.push(e.target.result);
                readFile(index + 1)
            }
            reader.readAsDataURL(file);
        }
        readFile(0);
    }

    const baseStyle = {
        minHeight: `${height}px`
    }
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? { borderColor: '#2196f3' } : {}),
        ...(isDragAccept ? { borderColor: '#00e676' } : {}),
        ...(isDragReject ? { borderColor: '#ff1744' } : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const handleRemoveFile = () => {
        setTargetSrc(null);
        onSelectedFileChange(null);
    }

    // BBox
    const imageRef = useRef(null);
    const [bboxScaled, setBBoxScaled] = useState(null);
    const getMeta = (url, callback) => {
        const img = new Image();
        img.src = url;
        img.onload = function () { callback(this.width, this.height); }
    }
    useEffect(() => {
        if (inputData && bbox && !isAudio) {
            getMeta(inputData, (width) => {
                try {
                    const currentWidth = imageRef.current.width;
                    const scale = currentWidth / width;
                    const bboxScaled = bbox.map((item) => item * scale);
                    setBBoxScaled({
                        left: bboxScaled[0],
                        top: bboxScaled[1],
                        width: bboxScaled[2] - bboxScaled[0],
                        height: bboxScaled[3] - bboxScaled[1]
                    });
                } catch (error) {
                    console.log(error);
                }
            });
        }
        setBBoxScaled(null);
    }, [inputData, bbox])

    return <div className="position-relative" {...rest}>
        <div {...getRootProps({ className: 'dropzone fs-upload-zone mb-3 bg-soft-primary', style })}>
            {targetSrc ? <div className="position-relative">
                {bboxScaled && <div className="fs-result-item-bbox position-absolute" style={{ width: bboxScaled.width, height: bboxScaled.height, top: bboxScaled.top, left: bboxScaled.left }}><div></div></div>}
                {
                    isAudio ? <>
                        {multiple ? <>
                            {targetSrc?.map((audio, index) => {
                                return <div className="mb-2" key={index}>
                                    <audio controls="controls" autobuffer="autobuffer">
                                        <source src={audio} />
                                    </audio>
                                </div>
                            })}
                        </> : <>
                            <audio controls="controls" autobuffer="autobuffer">
                                <source src={targetSrc} />
                            </audio>
                        </>
                        }

                    </> :
                        <img ref={imageRef} className="w-100" src={targetSrc} alt="" />
                }
            </div> : <div className="fs-upload-zone-desc">
                <input {...getInputProps()} />
                <div><i className="fas fa-cloud-upload-alt" style={{ fontSize: '40px' }}></i></div>
                <h6>Drag and drop or click here</h6>
                <p>{isAudio ? 'to upload your audio(s)' : 'to upload your image'}</p>
            </div>}
        </div>
        {targetSrc && showRemove && <Button type="button" variant="danger" size="sm" className="btn-remove-upload" onClick={handleRemoveFile}>
            <i className="fas fa-times mr-2"></i>
            <span>Remove</span>
        </Button>}
    </div>
}
export default UploadComponent;