import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTransactionReceipt } from "../../utils/services/reportService";
import { isNullOrWhitespace } from "../../utils/helpers/stringHelper";
import { Alert, ErrorAlert } from "../../components";

const Confirmation: FC = () => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const [requesrError, setRequestError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const donationId: number = Number(searchParams.get("donationId"));

  useEffect(() => {
    getTransactionReceipt(donationId).then((message) => {
      if (!isNullOrWhitespace(message)) {
        setRequestError(message);
      } else {
        setRequestError(null);
        setIsSent(true);
      }
    });
  }, [donationId]);
  return (
    <section className="donate" id="donate">
      <div className="container">
        <div className="donate__wrap text-center">
          {requesrError && <ErrorAlert errorMessage={requesrError} />}
          <h2 className="heading heading--light">
            Thank you for your donation!
          </h2>
          <p className="donate__description">
            Your support makes a great difference. We appreciate your generosity
            and commitment to our cause.
          </p>
          {isSent && (
            <Alert
              message={"We have sent your confirmation receipt via mail."}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Confirmation;
