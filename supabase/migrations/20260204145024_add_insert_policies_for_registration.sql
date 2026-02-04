/*
  # Add INSERT Policies for User Registration

  1. Changes
    - Add INSERT policy for profiles table to allow new user registration
    - Add INSERT policy for subscriptions table to allow automatic subscription creation
    - These policies allow users to create their own profile and subscription during signup
  
  2. Security
    - INSERT policy on profiles ensures users can only create their own profile (using auth.uid())
    - INSERT policy on subscriptions ensures users can only create subscriptions for themselves
*/

-- Allow users to create their own profile during signup
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to create their own subscription
CREATE POLICY "Users can insert own subscription"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own subscription
CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
