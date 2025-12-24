import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { userService } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import './TutorialPage.css';

const TutorialPage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const stepsConfig = [
    {
      id: "01",
      titleKey: "tutorial.steps.step1.title",
      descKey: "tutorial.steps.step1.desc",
      icon: "💬"
    },
    {
      id: "02",
      titleKey: "tutorial.steps.step2.title",
      descKey: "tutorial.steps.step2.desc",
      icon: "🤖"
    },
    {
      id: "03",
      titleKey: "tutorial.steps.step3.title",
      descKey: "tutorial.steps.step3.desc",
      icon: "✨"
    }
  ];

  // Hàm xử lý khi bấm nút "Bắt đầu chat" hoặc nút "Đã hiểu"
  const handleComplete = async () => {
    try {
      setIsLoading(true);
      
      // 1. Gọi API cập nhật DB
      const apiResponse = await userService.completeTutorial();

      
      // 2. Lấy dữ liệu user hiện tại đang lưu trong LocalStorage (để không bị mất id, jobTitle...)
      const storedUserStr = localStorage.getItem('user');
      const currentUser = storedUserStr ? JSON.parse(storedUserStr) : {};

      // 3. GỘP DỮ LIỆU: Giữ cái cũ + Cập nhật cái mới
      const mergedUser = {
          ...currentUser,           // Giữ lại id, role, jobTitle cũ...
          ...apiResponse,           // Ghi đè các trường mới từ API (nếu có)
          isTutorialCompleted: true // Đảm bảo chắc chắn field này là true
      };

      // 4. Cập nhật Context và LocalStorage với dữ liệu đã gộp
      setUser(mergedUser);
      localStorage.setItem('user', JSON.stringify(mergedUser));
      
      // 5. Chuyển trang
      navigate('/', { replace: true }); 

    } catch (error) {
      console.error("Lỗi khi hoàn thành tutorial:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tutorial-page">
      {/* 1. HEADER */}
      <header className="tutorial-header">
        <div className="app-name">Smart EXchange</div>
        <LanguageSwitcher /> 
      </header>

      {/* 2. TOP BANNER */}
      <div className="top-banner">
         {/* Đã thêm onClick={handleComplete} vào nút này để bấm là chuyển trang luôn */}
         <button 
            className="info-btn" 
            onClick={handleComplete}
            disabled={isLoading}
         >
            {t('tutorial.topBannerBtn')}
         </button>
      </div>

      <main className="tutorial-main">
        {/* TITLE */}
        <h1 className="page-title">{t('tutorial.pageTitle')}</h1>

        {/* 3. ZIGZAG CONTENT */}
        <div className="steps-container">
          {stepsConfig.map((item, index) => (
            <div key={index} className={`feature-row ${index % 2 !== 0 ? 'reverse' : ''}`}>
              <div className="feature-text">
                <div className="step-badge">
                    {t('tutorial.stepBadge')} {item.id}
                </div>
                <h3 className="feature-title">{t(item.titleKey)}</h3>
                <p className="feature-desc">{t(item.descKey)}</p>
                <p className="placeholder-text">
                  xxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>xxxxxxxxxxxxxxxxxxxxxxxxxxx
                </p>
              </div>
              <div className="feature-image-box">
                <div className="feature-icon">{item.icon}</div>
                <p className="img-caption">Image Placeholder</p>
              </div>
            </div>
          ))}
        </div>

        {/* 4. BOTTOM CTA */}
        <div className="bottom-cta-container">
          <div className="bottom-cta-box">
            <h3 className="cta-title">{t('tutorial.cta.title')}</h3>
            <p className="cta-desc">{t('tutorial.cta.desc')}</p>
            
            {/* Nút này đã có sẵn hàm handleComplete */}
            <button 
              onClick={handleComplete}
              className="start-btn"
              disabled={isLoading}
            >
              {isLoading ? t('tutorial.cta.loading') : t('tutorial.cta.btn')}
            </button>
            
            <p className="note-text">{t('tutorial.cta.note')}</p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default TutorialPage;