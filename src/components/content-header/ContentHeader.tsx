import { useNavigate } from "react-router-dom";

const ContentHeader = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  const handleRedirect = (route: string) => {
    navigate(route);
  };

  return (
    <section className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1>{title}</h1>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href="#" onClick={(e) => { e.preventDefault(); handleRedirect('/'); }}>
                  Home
                </a>
              </li>
              <li className="breadcrumb-item active">{title}</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentHeader;

