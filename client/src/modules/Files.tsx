import React from "react"
import { FileItem } from "../types/files"
import { FileActions } from "../components/FileActions"
import { FileList, FileSelectType } from "../components/FileList"
import { Empty } from "antd"

import * as Api from "../api"

interface FilesProps {
  items: FileItem[]
  withActions?: boolean
}

export const Files: React.FC<FilesProps> = ({ items, withActions }) => {
  const [files, setFiles] = React.useState(items || [])
  const [selectedIds, setSelectedIds] = React.useState<number[]>([])

  const onFileSelect = (id: number, type: FileSelectType) => {
    if (type === "select") {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((_id) => _id !== id))
    }
  }

  const onClickRemove = () => {
    setSelectedIds([])
    setFiles((prev) => prev.filter((file) => !selectedIds.includes(file.id)))
    Api.files.remove(selectedIds)
  }
  
  let imageUrl = ""
  if (files[0]) {
    imageUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/` + files[0].filename
  }

  console.log(imageUrl)
  const onClickShare = () => {
    if (files[0].filename) {
      navigator.clipboard.writeText(imageUrl)
    }
  }

  return (
    <div>
      {files.length ? (
        <>
          {withActions && (
            <FileActions
              onClickRemove={onClickRemove}
              onClickShare={onClickShare}
              isActive={selectedIds.length > 0}
              imageUrl={imageUrl}
            />
          )}
          <FileList items={files} onFileSelect={onFileSelect} />
        </>
      ) : (
        <Empty className="empty-block" description="No files found" />
      )}
    </div>
  )
}