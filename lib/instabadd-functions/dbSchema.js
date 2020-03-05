/**
 * This is a reference file that has
 * no implications on the code
 */

let db = {
  users: [
    {
      userId: '33r3tgw4tw4t',
      username: "user2",
      email: 'user@gmail.com',
      createdAt: '2019-03-12T10:34:33.789Z',
      imageUrl: 'image/sfwefewf/wefwefew',
      bio: 'Hello my name is user, nice to meet you',
      website: 'https://user.com',
      posts: ['documentID1', 'documentID2'],
      followers: ['userID1', 'userID2'],
      following: ['userID1', 'userID2']
    }
  ],
  posts: [
    {
      username: 'user1',
      body: 'this is a dummy post',
      createdAt: '2020-02-25T22:25:05.245Z',
      likeCount: 5,
      commentCount: 2,
      comments: ['documentID1', 'documentID2']
    }
  ],
  comments: [
    {
      postID: 'documentID',
      username: 'user2',
      body: 'nice one mate!',
      createdAt: '2019-03-15T10:59:52.798Z'
    }
  ],
  notifications: [
    {
      recipient: 'user',
      sender: 'john',
      read: 'true | false',
      postId: 'kdjsfgdksuufhgkdsufky',
      type: 'comment',
      createdAt: '2019-03-15T10:59:52.798Z'
    }
  ]
}

const userDetails = {
  // Redux data
  credentials: {
    userId: '33r3tgw4tw4t',
    username: "user2",
    email: 'user@gmail.com',
    createdAt: '2019-03-12T10:34:33.789Z',
    imageUrl: 'image/sfwefewf/wefwefew',
    bio: 'Hello my name is user, nice to meet you',
    website: 'https://user.com',
    posts: ['documentID1', 'documentID2'],
    followers: ['userID1', 'userID2'],
    following: ['userID1', 'userID2']
  }
};