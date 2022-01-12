<template>
  <b-container>
    <b-card>
      <amplify-authenticator v-if="authState !== 'signedin'">
        <amplify-sign-in
          header-text="My Custom Sign In Text"
          slot="sign-in"
          :form-fields.prop="formFields"
        ></amplify-sign-in>
        <amplify-sign-up
          header-text="My Custom Sign Up Text"
          slot="sign-up"
          :form-fields.prop="formFields"
        ></amplify-sign-up>
      </amplify-authenticator>
      <div v-if="authState === 'signedin' && user">
        <!-- <amplify-greetings :username="user.username"></amplify-greetings> -->
        <!-- <amplify-sign-out button-text="Custom Text"></amplify-sign-out> -->
        <div>Hello user, {{ user.username }} have a happy day!</div>
        <amplify-sign-out></amplify-sign-out>
      </div>
    </b-card>
  </b-container>
</template>

<script>
import { onAuthUIStateChange } from "@aws-amplify/ui-components";

export default {
  name: "Home",
  components: {},
  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    });
  },
  data() {
    return {
      user: undefined,
      authState: undefined,
      formFields: [
        {
          type: "username",
          label: "Custom username Label",
          placeholder: "custom username placeholder",
          required: true,
        },
        {
          type: "password",
          label: "Custom Password Label",
          placeholder: "custom password placeholder",
          required: true,
        },
      ],
    };
  },
  beforeDestroy() {
    return onAuthUIStateChange;
  },
};
</script>

<style>
amplify-authenticator {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: auto;
}
</style>
