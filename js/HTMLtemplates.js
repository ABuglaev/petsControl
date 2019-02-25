//HTML templates
const signUpHTML = `
                    <form name="signup" id="signUpForm" class='hidden'>
                      <input  type="text"     id="signUpLogin"    placeholder="login"    name="login" required> <br>
                      <input  type="password" id="signUpPassword" placeholder="password" name="password"  required> <br>
                      <input  type="password" id="signUpConfirm"  placeholder="confirm"  required> <br>
                      <input  type="email"    id="signUpemail"    placeholder="email"    name="email" required> <br>
                      <input  type="text"     id="signUpname"     placeholder="name"     name="name" required> <br>
                      <button type="submit"   id="signUpButton">Sign Up</button> <br>  <br>
                      <button type="button"   id="backToSignIn">Back to Sign In</button> <br>
                    </form>
                    `;
const signInHTML = `
                    <form name="signin" id="signInForm" class='visiable'>
                      <input  type="text"     id="signInLogin"    placeholder="login"    name="login"    required> <br>
                      <input  type="password" id="signInPassword" placeholder="password" name="password" required> <br>
                      <button type="submit"   id="signInButton" >Sign In</button> <br>
                      <button type="button"   id="GOTOsignUp">Sign Up</button> <br>
                    </form>
                    `;