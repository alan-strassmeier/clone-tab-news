function Home() {
    return (
        <div className="container">
            <h1>Xinha é linda e cheirosa :)</h1>

            <style jsx>{`
        .container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        h1 {
          color: red;
        }
      `}</style>
        </div>
    );
}

export default Home;
