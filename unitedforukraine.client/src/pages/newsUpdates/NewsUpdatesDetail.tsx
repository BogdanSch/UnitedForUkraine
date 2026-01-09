import { FC, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { NewsUpdateDto } from "../../types";
import AuthContext from "../../contexts/AuthContext";
import {
  fetchNewsUpdateData,
  incrementNewsUpdateViews,
} from "../../utils/services/newsUpdateService";
import { Alert, CampaignItem, Card, Image } from "../../components";
import { DeleteNewsUpdateForm, DonationsList } from "../../containers";
import { convertToReadableDate } from "../../utils/helpers/dateHelper";

const NewsUpdatesDetail: FC = () => {
  const [newsUpdate, setNewsUpdate] = useState<NewsUpdateDto | null>(null);
  const { isAdmin, isAuthenticated } = useContext(AuthContext);

  let { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const message: string = location.state?.message || "";

  useEffect(() => {
    const fetcher = () => {
      fetchNewsUpdateData(Number(id)).then((data) => {
        if (!data) {
          navigate("/notFound");
          return;
        }
        setNewsUpdate(data);
      });
    };
    fetcher();

    if (!isAuthenticated()) return;
    incrementNewsUpdateViews(Number(id));
  }, [id]);

  return (
    <section className="news-detail">
      <div className="container">
        <div className="news-detail__wrap">
          {message && <Alert className="mt-3 mb-3" message={message} />}
          <article className="news-detail__blog">
            {isAuthenticated() && isAdmin() && (
              <ul className="news-detail__buttons-list">
                <li className="news-detail__buttons-item">
                  <Link
                    className="btn btn-primary btn-icon"
                    to={`/newsUpdates/edit/${id}`}
                  >
                    <span>Edit this News update</span>
                    <i className="bi bi-pencil-square"></i>
                  </Link>
                </li>
                <li className="news-detail__button-item btn-icon">
                  <DeleteNewsUpdateForm id={Number(id)} />
                </li>
              </ul>
            )}
            <Card className="news-detail__info card mb-4" isLite={false}>
              <div className="text-content mb-4">
                <h1 className="heading mb-0">{newsUpdate?.title}</h1>
                <p className="news-detail__description">
                  {newsUpdate?.keyWords}
                </p>
                <p className="mt-0">
                  <strong>{newsUpdate?.viewsCount}</strong> views
                </p>
              </div>
              <Image
                imageClassName="news-detail__image"
                src={newsUpdate?.imageUrl!}
                alt={newsUpdate?.title!}
              />
              <div className="mt-4 text-content">
                <ul className="news-detail__meta-list mb-5">
                  <li className="news-detail__meta-item">
                    <i className="bi bi-calendar-plus"></i>
                    {/* <strong>Published on:</strong>{" "} */}
                    {convertToReadableDate(newsUpdate?.postedAt || "")}
                  </li>
                  <li className="news-detail__meta-item">
                    <i className="bi bi-pencil-square"></i>
                    {/* <strong> by </strong>  */}
                    {newsUpdate?.authorName}
                  </li>
                  <li className="news-detail__meta-item">
                    <i className="bi bi-clock"></i>
                    <strong>{newsUpdate?.readingTimeInMinutes} min.</strong>
                  </li>
                </ul>
                <div className="news-detail__content">
                  {newsUpdate?.content}
                </div>
                <div className="mt-3">
                  <Link
                    className="news-detail__link btn btn-secondary"
                    to={`/campaigns/detail/${newsUpdate?.targetCampaign.id}`}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-search"></i>
                      <span>Check out the campaign</span>
                    </div>
                  </Link>
                </div>
              </div>
            </Card>
            <div className="news-detail__campaign mt-5">
              <h2 className="sub-heading">
                Related to: {newsUpdate?.targetCampaign.title}
              </h2>
              {newsUpdate && (
                <ul className="campaigns__list">
                  {
                    <CampaignItem
                      campaign={newsUpdate.targetCampaign}
                      searchQuery={""}
                    />
                  }
                </ul>
              )}
            </div>
            {newsUpdate?.targetCampaign.id && (
              <div className="donations mt-5">
                <h3 className="sub-heading">
                  All contribution from the community to this campaign
                </h3>
                <DonationsList
                  name="campaignDonations"
                  campaignId={Number(newsUpdate?.targetCampaign.id)}
                  showUserDonations={false}
                  showQueryCriteria={false}
                />
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
};

export default NewsUpdatesDetail;
