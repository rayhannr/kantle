import { Cell } from "../grid/Cell";
import { BaseModal } from "./BaseModal";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="Cara Main" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
        Tebak kata dalam 6 percobaan. 1 hari 1 kata rahasia.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
        Setiap tebakan harus merupakan kata valid 6 huruf sesuai KBBI. Tekan{" "}
        <span className="font-semibold">Enter</span> untuk mengirim tebakan.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Setelah setiap tebakan, warna kotak akan berubah untuk menunjukkan seberapa dekat tebakanmu dengan kata rahasia.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell isRevealing isCompleted value="H" status="correct" />
        <Cell value="A" />
        <Cell value="N" />
        <Cell value="D" />
        <Cell value="U" />
        <Cell value="K" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">Huruf H ada dan di posisi yang benar.</p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell value="P" />
        <Cell value="I" />
        <Cell isRevealing isCompleted value="N" status="present" />
        <Cell value="T" />
        <Cell value="A" />
        <Cell value="R" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">Huruf N ada, tapi di tempat yang salah.</p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell value="N" />
        <Cell value="E" />
        <Cell value="G" />
        <Cell isRevealing isCompleted value="A" status="absent" />
        <Cell value="R" />
        <Cell value="A" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">Huruf A tidak ada dalam kata.</p>

      <p className="mt-6 italic text-sm text-gray-500 dark:text-gray-300">
        Kantle terinspirasi dari{" "}
        <a
          href="https://katla.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 dark:text-sky-500 outline-none"
        >
          Katla
        </a>{" "}
        dan{" "}
        <a
          href="https://github.com/cwackerfuss/react-wordle"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 dark:text-sky-500 outline-none"
        >
          Reactle
        </a>
      </p>
    </BaseModal>
  );
};
