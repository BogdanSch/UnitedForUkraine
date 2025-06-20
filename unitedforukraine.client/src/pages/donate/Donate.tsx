import { FC } from "react";
import { useParams } from "react-router-dom";
import { DonateForm } from "../../containers";

const Donate: FC = () => {
  const params = useParams();
  const id: number = Number(params.id);

  return (
    <section className="donate" id="donate">
      <div className="container">
        <div className="donate__wrap">
          <DonateForm campaignId={id} />
        </div>
      </div>
    </section>
  );
};

export default Donate;
