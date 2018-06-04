<div class="container" >
		<div class="logo_header text-center">
			<a href="#"><img src="images/logo.png" alt="" /></a>
		</div>
		<div class="login_form_outer">
			<div class="login_form">
				<h2>Sign Up</h2>
				<div class="form-group">
					<label>Name</label>
					<input type="text" ng-model="name" value="" placeholder="" class="form-control" />
				</div>
				<div class="form-group">
					<label>Email</label>
					<input type="text" ng-model="email" value="" placeholder="" class="form-control" />
				</div>
				<div class="form-group">
					<label>Password</label>
					<input type="password" ng-model="password" value="" placeholder="" class="form-control" />
				</div>
				<a ng-click="signup()" class="blue_btn">Sign Up</a>
			</div>
			<img src="images/shadow.png" alt="" class="shadow" />
		</div>
</div>