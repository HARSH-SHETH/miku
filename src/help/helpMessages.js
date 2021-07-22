// DEFINE HELP MESSAGES FOR ALL COMMANDS

module.exports = {
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 HELP: `
 Usage: !miku help base_command

 base_command is the command you
 want to query.

 For eg:
   [!miku help sfw]  - will show
   the help message about sfw 
   command
 `,
 MINNA: `
 Usage: !minna

 minna stands for everyone.
 You can use this command inside
 groups to tag everyone.

 This command will be unavailable
 inside a blocked group.
 `,
 SFW: `
 Usage: !miku sfw - print all
                   categories
 
   --> !miku sfw <category> 

 For eg: [!miku sfw dance]

 This command fetches a random
 anime gif or image depending on
 the category you choose.

 This command is not unavailable
 inside a blocked group.
 `,
 REVEAL: `
 Usage: !miku reveal [count]

 [count] is a number from 1-15

 reveals the last [count] 
 deleted text chats.
  
 If count is not given it prints 
 the last deleted chat.
  `,
  POLL: `
  Usage: !miku poll

  This starts a poll. Group
  participants can vote yes or
  no using: 
    --> !miku n 
    --> !miku y

  You can vote as many time as
  you want only the last vote 
  will be counted.

  !miku poll status - This
                prints the 
  status of current running 
  poll.

  !miku poll end - Ends the poll
                  and prints the 
  result.

  Poll can only be end by the
  host or bot owner.
  `,
  RESULT: `
  Usage: !miku result roll_no

  roll_no should be a valid NITH
  roll no.

  Fetches and prints the result
  of given roll_no.
  `,
  UPDATES: `
  Usage: !miku updates

  Fetches the last 5 latest
  announcements from nith.ac.in
  
  Result is cached for 10 min.
  `,
  STICKER: `
  Usage: !miku sticker

  --> Command should be attached
  with a image or media file.
  (quoted media won't count)

  This will generate an animated
  sticker from the video or a 
  normal sticker if media is an
  image.

  If u want to generate an 
  animated sticker from a 
  video_url, then send the video 
  url and quote the msg with:

  1. !miku sticker
    Or
  2. !miku sticker hh:mm:ss

  The 2nd command will generate
  the sticker from the given
  timestamp.

  Some valid timestamps:
    01:23:25
    01:23
    23

  If you don't understand the
  command usage request bot
  owner to show you a demo.
  `
}
