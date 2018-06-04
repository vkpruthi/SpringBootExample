<div class="container">
		<div class="logo_header text-center">
			<a href="#"><img src="images/logo.png" alt="" /></a>
		</div>
		<div class="login_form_outer">
			<div class="login_form">
				<h2>Sign In</h2>
				<div class="form-group">
					<label>Email</label>
					<input type="text" value="" ng-model="email" placeholder="" class="form-control" />
				</div>
				<div class="form-group">
					<label>Password</label>
					<input type="password" ng-model="password" value="" placeholder="" class="form-control" />
				</div>
				<p class="forgot_password"><a href="#signup">Sign up</a></p>
				<!-- <button type="submit" class="blue_btn">Sign In</button> -->
				<a ng-click="loginUser()" class="blue_btn">Sign In</a>
			</div>
			<img src="images/shadow.png" alt="" class="shadow" />
		</div>
</div>