from azure.storage.blob import BlockBlobService,ContentSettings
import ntpath
import base64

#block_blob_service = BlockBlobService("iloveplatos","TsUfxEh3amlGgSBDrvtL4tyCumNJgeNAxUjpQN+51kAQEvo1HSsg5ZJTKmJ5OEppFgyEp2uVIajp600WgKx+Pw==")
block_blob_service = BlockBlobService("iloveplatos","wyXIf+bdgRQV8gKhx55c66StykqxUcwxxyCaaHKgkveU1dMSVlfwysfVpp7ACmq1QH7s0J9Vl83SkffL33VREQ==")


def uploadFile(file):
    algo = block_blob_service.create_blob_from_path(
        "images",
        "plates/" + ntpath.basename(file),
        file,
        content_settings=ContentSettings(content_type="image/png")
    )
    return algo

def uploadBinary(json):
    block_blob_service.create_blob_from_bytes("images",json["dir"]+"/"+json["name"],base64.b64decode(json["image"]),content_settings=ContentSettings(content_type="image/png"))
    return {"image":"https://iloveplatos.blob.core.windows.net/images/"+json["dir"]+"/"+json["name"]}
