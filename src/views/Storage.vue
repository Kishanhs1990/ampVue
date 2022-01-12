<template>
  <b-container align="center">
    <b-card style="max-width: 40rem">
      <b-card
        align="right"
        sub-title="Upload a file to S3 bucket"
        class="text-center"
      >
        <b-card-text>
          Select and upload a file to your S3 folder. Select the folder to store
          the file and then choose the file
        </b-card-text>
        <div>
          <b-form-select
            v-model="selected"
            :options="options"
            class="mt-3"
          ></b-form-select>
          <div class="mt-3">
            Selected: <strong>{{ selected }}</strong>
          </div>
        </div>
        <input type="file" @change="upload_onFileChanged" class="mt-3" />
      </b-card>
      <b-card
        align="right"
        sub-title="List files in S3 bucket"
        class="text-center mt-3"
      >
        <b-card-text>
          List the files in a particular folder. Select the folder where the
          file is stored
        </b-card-text>
        <div>
          <b-form-select
            v-model="selected"
            :options="options"
            class="mt-3"
          ></b-form-select>
          <div class="mt-3">
            Selected: <strong>{{ selected }}</strong>
          </div>
        </div>
        <b-button variant="primary" @click="listFiles()" class="mt-3"
          >List S3 files</b-button
        >
      </b-card>
      <b-card
        align="right"
        sub-title="Download a S3 file"
        class="text-center mt-3"
      >
        <b-card-text>
          Download a S3 file. Enter the filename and then select the folder
          where the file is stored
        </b-card-text>
        <b-form-input
          v-model="filename"
          placeholder="Enter filename here"
        ></b-form-input>
        <div>
          <b-form-select
            v-model="selected"
            :options="options"
            class="mt-3"
          ></b-form-select>
          <div class="mt-3">
            Selected: <strong>{{ selected }}</strong>
          </div>
        </div>
        <b-button variant="primary" @click="downloadFile()" class="mt-3"
          >Download S3 file</b-button
        >
      </b-card>
      <b-card
        align="right"
        sub-title="Delete an S3 file"
        class="text-center mt-3"
      >
        <b-card-text>
          Delete an S3 file. Enter the filename and then select the folder where
          the file is stored
        </b-card-text>
        <b-form-input
          v-model="filename"
          placeholder="Enter filename here"
        ></b-form-input>
        <div>
          <b-form-select
            v-model="selected"
            :options="options"
            class="mt-3"
          ></b-form-select>
          <div class="mt-3">
            Selected: <strong>{{ selected }}</strong>
          </div>
        </div>
        <b-button variant="danger" @click="deleteFile()" class="mt-3"
          >Delete S3 file</b-button
        >
      </b-card>
    </b-card>
    <b-button variant="primary" @click="getOtherUserFile()" class="mt-3"
      >get other user's file</b-button
    >
    <b-button variant="primary" @click="listOtherUSersFiles()" class="mt-3 ml-3"
      >list other user's files</b-button
    >
    <b-button variant="primary" @click="generateDownloadUrl()" class="mt-3 ml-3"
      >generate url</b-button
    >
  </b-container>
</template>

<script>
import { Storage } from "aws-amplify";
const axios = require("axios");

export default {
  name: "Storage",
  components: {},
  data() {
    return {
      selectedFile: null,
      filename: "",
      selected: null,
      options: [
        { value: null, text: "Please select folder option" },
        { value: "protected", text: "Protected" },
        { value: "private", text: "Private" },
        { value: "public", text: "Public" },
      ],
    };
  },
  methods: {
    deleteFile() {
      console.log(
        "deleting filename: " + this.filename + " in folder: " + this.selected
      );
      Storage.remove(this.filename, { level: this.selected })
        .then((result) => console.log(JSON.stringify(result, null, 2)))
        .catch((err) => console.log(JSON.stringify(err, null, 2)));
      this.selected = null;
      this.filename = "";
    },
    downloadAxios(saveFilename, url) {
      axios({
        url: url,
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          console.log("download success ");

          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");

          fileLink.href = fileURL;
          fileLink.setAttribute("download", saveFilename);
          document.body.appendChild(fileLink);

          fileLink.click();
        })
        .catch((err) => {
          console.log("download error " + JSON.stringify(err, null, 2));
        });
    },
    downloadFile() {
      console.log(
        "getting filename: " + this.filename + " in folder: " + this.selected
      );
      let saveFilename = this.filename;
      Storage.get(this.filename, { level: this.selected })
        .then((result) => {
          console.log("download file url " + result);
          this.downloadAxios(saveFilename, result);
        })
        .catch((err) => console.log(err));
      this.selected = null;
      this.filename = "";
    },
    listFiles() {
      console.log("listing files in folder: " + this.selected);

      Storage.list("", { level: this.selected })
        .then((result) => console.log(JSON.stringify(result, null, 2)))
        .catch((err) => console.log(JSON.stringify(err, null, 2)));
      this.selected = null;
    },
    upload_onFileChanged(event) {
      console.log("file changed....");
      this.selectedFile = event.target.files[0];
      this.uploadFile();
    },
    uploadFile() {
      console.log(
        "uploading filename: " +
          this.selectedFile.name +
          " in folder: " +
          this.selected
      );
      Storage.put(this.selectedFile.name, this.selectedFile, {
        level: this.selected,
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      })
        .then((result) =>
          console.log(
            "success uploading file: " + JSON.stringify(result, null, 2)
          )
        )
        .catch((err) =>
          console.log("error uploading file: " + JSON.stringify(err, null, 2))
        );
      this.filename = "";
      this.selected = null;
    },
    getOtherUserFile() {
      // use your own file name
      Storage.get("penguin.png", {
        level: "protected",
        identityId: "eu-west-2:bb8faa39-68db-440d-8389-47ea44a3f09a", // the identityId of that user
      })
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    },
    listOtherUSersFiles() {
      Storage.list("", {
        level: "protected",
        identityId: "eu-west-2:bb8faa39-68db-440d-8389-47ea44a3f09a", // the identityId of that user
      })
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    },
    generateDownloadUrl() {
      // use your own file name
      Storage.get("plane.jpg", { expires: 60 })
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    },
  },
};
</script>
