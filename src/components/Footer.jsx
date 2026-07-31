import "remixicon/fonts/remixicon.css";

import AppleDock from "./AppleDock/AppleDock";
import WhatsAppButton from "./WhatsAppButton/WhatsAppButton";
import TextPressure from "./TextPressure/TextPressure";

import {
  RiGithubLine,
  RiInstagramLine,
  RiLinkedinLine,
  RiWhatsappLine,
  RiMailLine,
} from "react-icons/ri";

const Footer = () => {
  const socialItems = [
    {
      icon: <RiGithubLine size={22} />,
      label: "GitHub",
      onClick: () =>
        window.open("https://github.com/Irsyad-ald", "_blank"),
    },
    {
      icon: <RiInstagramLine size={22} />,
      label: "Instagram",
      onClick: () =>
        window.open("https://instagram.com/irsyad_ald", "_blank"),
    },
    {
      icon: <RiLinkedinLine size={22} />,
      label: "LinkedIn",
      onClick: () =>
        window.open("https://linkedin.com/in/irsyad_ald", "_blank"),
    },
    {
      icon: <RiWhatsappLine size={22} />,
      label: "WhatsApp",
      onClick: () =>
        window.open("https://wa.me/6287767132263", "_blank"),
    },
    {
      icon: <RiMailLine size={22} />,
      label: "Email",
      onClick: () =>
        window.open("irald0357@gmail.com", "_blank"),
    },
  ];

  return (
    <>
      <footer className="relative w-full h-[750px] overflow-hidden mt-32">

        {/* PORTOFOLIO */}

        <div className="absolute bottom-[220px] left-1/2 -translate-x-1/2 w-full h-[250px] z-10">
          <TextPressure
            text="Portofolio"
            flex={true}
            scale={false}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={false}
            textColor="rgba(87, 87, 87, 1)"
            strokeColor="#ffffff"
            minFontSize={220}
          />
        </div>

        {/* Apple Dock */}

        <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 z-20">
          <AppleDock items={socialItems} />
        </div>

        {/* WhatsApp */}

        <div className="absolute right-8 bottom-8 z-30">
          <WhatsAppButton />
        </div>
      </footer>

      <style>{`
        @media (max-width: 1024px) {
          footer {
            height: 650px;
          }
        }

        @media (max-width: 768px) {
          footer {
            height: 550px;
          }
        }

        @media (max-width: 640px) {
          footer {
            height: 500px;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;