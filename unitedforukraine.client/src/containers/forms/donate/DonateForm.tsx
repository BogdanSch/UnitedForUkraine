import { protectedAxios } from "../../../utils/axiosInstances";
import axios from "axios";
import { FC, useState, useEffect, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CreateDonationRequestDto } from "../../../types";
import { PaymentMethod, Currency } from "../../../types/enums";
import {
  API_URL,
  donatinsTemplatesOtherCurrencies,
  donatinsTemplatesUAH,
} from "../../../variables";
import { ErrorAlert, Input } from "../../../components";
import { useCustomForm } from "../../../hooks";
import AuthContext from "../../../contexts/AuthContext";
import { convertCurrencyToSymbol } from "../../../utils/helpers/currencyHelper";

interface IDonateFormProps {
  campaignId: number;
}

const getDefaultData = (
  userId: string,
  campaignId: number
): CreateDonationRequestDto => ({
  userId: userId,
  amount: 1,
  notes: "",
  currency: Currency.UAH,
  paymentMethod: PaymentMethod.CreditCard,
  campaignId: campaignId,
});

const DonateForm: FC<IDonateFormProps> = ({ campaignId }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState<CreateDonationRequestDto>(
    getDefaultData("", campaignId)
  );

  const [validationErrors, setValidationErrors] = useState<Record<string, any>>(
    {}
  );
  const [requestError, setRequestError] = useState<string>("");
  const { handleChange, handleSelectChange } = useCustomForm(setFormData);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userId: user?.id ?? "",
    }));
  }, [user]);

  const isValid = (): boolean => {
    if (formData.userId.length === 0) {
      navigate("/auth/login");
      return false;
    }

    const newErrors: Record<string, string> = {};

    if (formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than zero";
    }
    if (formData.amount > 10e12) {
      newErrors.amount = "Amount must be smaller than one trillion!";
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createPaymentSession = async (donationId: number): Promise<void> => {
    try {
      const { data } = await protectedAxios.post(
        `${API_URL}/payments/${donationId}`
      );

      if (!data.redirectUrl) {
        throw new Error("Payment session failed!");
      }

      console.log(data.redirectUrl);

      window.location.href = data.redirectUrl;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setRequestError(
          error.response?.data.message ||
            "Failed to create payment session. Please try again later!"
        );
      } else {
        console.error(`Error creating payment session: ${error}`);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!isValid()) return;

    try {
      const { data } = await protectedAxios.post(
        `${API_URL}/donations/`,
        formData
      );
      console.log(data);

      if (!data.id) throw new Error("Donation creation failed");
      await createPaymentSession(data.id);
    } catch (error) {
      setRequestError("Failed to make a donation. Please, try again later!");
      console.error("Error creating payment session:", error);
    }
  };

  const handleReset = (): void => {
    setFormData(getDefaultData(user?.id ?? "", campaignId));
    setValidationErrors({ amount: "" });
  };

  const incrementAmount = (
    event: React.MouseEvent<HTMLButtonElement>,
    amount: number
  ): void => {
    event.preventDefault();
    setFormData((prev) => ({
      ...prev,
      amount: prev.amount + amount,
    }));
  };

  return (
    <form
      className="form px-4 py-3 card donate__form"
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <div className="text-center mt-3 mb-3">
        <h2 className="donate__title sub-heading">
          Help Ukraine means <strong>Save a life!</strong>
        </h2>
        <p className="donate__subtitle">
          Your donation will help us to provide humanitarian aid to people in
          need.
        </p>
      </div>
      {requestError.length > 0 && <ErrorAlert errorMessage={requestError} />}
      <div className="mb-3">
        <label htmlFor="amount" className="form-label">
          Choose your donation amount*
        </label>
        <Input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          min={1}
          max={10e12}
          isRequired={true}
        />
        <ul className="donate__list mt-3">
          {(formData.currency === Currency.UAH
            ? donatinsTemplatesUAH
            : donatinsTemplatesOtherCurrencies
          ).map((amount: number) => (
            <li className="donate__list-item" key={amount}>
              <button
                className="btn btn-lg btn-light"
                onClick={(event) => incrementAmount(event, amount)}
              >
                {`+${amount}${convertCurrencyToSymbol(formData.currency)}`}
              </button>
            </li>
          ))}
        </ul>
        {validationErrors.amount && (
          <ErrorAlert errorMessage={validationErrors.amount} />
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="currency" className="form-label">
          Select your currency*
        </label>
        <select
          id="currency"
          name="currency"
          className="form-select"
          aria-label="Campaign currency select"
          value={formData.currency}
          onChange={handleSelectChange}
        >
          {Object.keys(Currency)
            .filter((key) => !isNaN(Number(Currency[key as any])))
            .map((key) => (
              <option key={key} value={Currency[key as keyof typeof Currency]}>
                {key}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="paymentMethod" className="form-label">
          Select your payment method*
        </label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          className="form-select"
          aria-label="Campaign payment method select"
          value={formData.paymentMethod}
          onChange={handleSelectChange}
        >
          {Object.keys(PaymentMethod)
            .filter((key) => !isNaN(Number(PaymentMethod[key as any])))
            .map((key) => (
              <option
                key={key}
                value={PaymentMethod[key as keyof typeof PaymentMethod]}
              >
                {key}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="notes" className="form-label">
          Type any wishes if you want to
        </label>
        <Input
          id="notes"
          name="notes"
          className="form-select"
          aria-label="User notes input"
          value={formData.notes}
          onChange={handleChange}
          isRequired={false}
        />
      </div>
      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button type="reset" className="btn btn-outline-danger">
          Reset
        </button>
      </div>
    </form>
  );
};

export default DonateForm;
