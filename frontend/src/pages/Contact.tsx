const Page = () => {
    return(
      <div className="contact-container">
        <form>
          <label htmlFor="name"></label>
          <input type="text" name="name" id="" placeholder="John Doe" />
          <label htmlFor="email"></label>
          <input type="email" name="email" id="" placeholder="JohnDoe@email.com" />
          <label htmlFor="content"></label>
          <textarea name="content" id="" cols="30" rows="10"></textarea>

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  };
  
  export default Page;