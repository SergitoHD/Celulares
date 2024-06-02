"use client"

import { fileToBase64 } from "@/actions/convert-file-to-base64";
import { Dropzone, ExtFile, FileMosaic, FileMosaicProps } from "@files-ui/react";
import * as React from "react";

export default function DragAndDropImage({handleImage}:{handleImage: (url: string) => void}) {
  const [files, setFiles] = React.useState<ExtFile[]>([]);
  const updateFiles = async(incommingFiles: ExtFile[]) => {
    const file = incommingFiles[0].file as File;
    const base64 = await fileToBase64(file);
    handleImage(base64);

    setFiles(incommingFiles);

  };
  const removeFile = (id: FileMosaicProps["id"]) => {
    handleImage('');
    setFiles(files.filter((x) => x.id !== id));
  };
  return (
    <Dropzone
      onChange={updateFiles}
      value={files}
      header={false}
      footer={false}
      label="Agrega una imagen"
      accept=".webp, .png, .jpg, .jpeg/*"
      maxFiles={1}
      minHeight="135px"
    >
      {files.map((file) => (
        <FileMosaic key={file.id} 
        {...file} 
        onDelete={removeFile} 
        preview
        resultOnTooltip
        alwaysActive
        />
      ))}
    </Dropzone>
  );
}
