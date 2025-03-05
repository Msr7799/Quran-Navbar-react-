import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  MapPin,
  LocateFixed,
  Crosshair,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const QiblaPage = () => {
  const [orientation, setOrientation] = useState(null);
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('initial'); // initial, granted, denied, unsupported
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // الإحداثيات الثابتة للكعبة المشرفة
  const KAABA_COORDINATES = {
    latitude: 21.4225,
    longitude: 39.8262
  };

  useEffect(() => {
    // التحقق من دعم المتصفح لواجهة DeviceOrientationEvent
    if (window.DeviceOrientationEvent) {
      // طلب الإذن في متصفحات iOS
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        setPermissionStatus('requires-permission');
      } else {
        setPermissionStatus('granted');
        startCompass();
      }
    } else {
      setPermissionStatus('unsupported');
    }

    return () => {
      // تنظيف مستمعي الأحداث عند إلغاء تحميل المكون
      window.removeEventListener(
        'deviceorientationabsolute',
        handleOrientation
      );
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const requestPermission = async () => {
    try {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setPermissionStatus('granted');
          startCompass();
        } else {
          setPermissionStatus('denied');
        }
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      setPermissionStatus('denied');
    }
  };

  const startCompass = () => {
    setIsCalibrating(true);

    // محاولة الحصول على الاتجاه المطلق (أكثر دقة)
    if (
      window.DeviceOrientationEvent &&
      'ondeviceorientationabsolute' in window
    ) {
      window.addEventListener('deviceorientationabsolute', handleOrientation);
    }
    // استخدام الاتجاه العادي إذا لم يكن الاتجاه المطلق متاحًا
    else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    // الحصول على الموقع الجغرافي
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          calculateQiblaDirection(
            position.coords.latitude,
            position.coords.longitude
          );
          setIsCalibrating(false);
        },
        error => {
          console.error('Error getting geolocation:', error);
          setIsCalibrating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsCalibrating(false);
    }
  };

  const handleOrientation = event => {
    // استخراج زاوية الاتجاه من الحدث
    let compassHeading;

    if (event.webkitCompassHeading) {
      // iOS - يعطي القيمة مباشرة بالدرجات من الشمال (0) في اتجاه عقارب الساعة
      compassHeading = event.webkitCompassHeading;
    } else {
      // أندرويد وأنظمة أخرى
      compassHeading = 360 - event.alpha; // تحويل القيمة لتتوافق مع البوصلة
    }

    setOrientation(compassHeading);
  };

  const calculateQiblaDirection = (latitude, longitude) => {
    // حساب اتجاه القبلة باستخدام معادلة علم الملاحة
    const userLat = latitude * (Math.PI / 180);
    const userLng = longitude * (Math.PI / 180);
    const kaabaLat = KAABA_COORDINATES.latitude * (Math.PI / 180);
    const kaabaLng = KAABA_COORDINATES.longitude * (Math.PI / 180);

    const y = Math.sin(kaabaLng - userLng);
    const x =
      Math.cos(userLat) * Math.tan(kaabaLat) -
      Math.sin(userLat) * Math.cos(kaabaLng - userLng);

    let qiblaAngle = Math.atan2(y, x) * (180 / Math.PI);
    qiblaAngle = (qiblaAngle + 360) % 360; // التأكد من أن الزاوية بين 0 و 360

    setQiblaDirection(qiblaAngle);
  };

  // تحديد لون النص بناءً على دقة اتجاه القبلة
  const getDirectionColor = () => {
    if (orientation !== null && qiblaDirection !== null) {
      // حساب الفرق بين اتجاه الجهاز واتجاه القبلة
      const diff = Math.abs((orientation - qiblaDirection + 360) % 360);

      if (diff <= 5) return 'text-success'; // اتجاه دقيق جدًا (5 درجات)
      if (diff <= 15) return 'text-info'; // اتجاه قريب
      if (diff <= 45) return 'text-warning'; // بعيد قليلاً
      return 'text-error'; // بعيد جداً
    }
    return 'text-neutral-content';
  };

  const getDirectionMessage = () => {
    if (orientation !== null && qiblaDirection !== null) {
      const diff = Math.abs((orientation - qiblaDirection + 360) % 360);

      if (diff <= 5) return 'أنت تواجه القبلة مباشرة';
      if (diff <= 15) return 'أنت قريب من اتجاه القبلة';
      if (diff <= 45) return 'استدر قليلاً للوصول لاتجاه القبلة';
      if (diff <= 90) return 'استدر أكثر للوصول لاتجاه القبلة';
      return 'أنت في الاتجاه المعاكس تقريبًا';
    }
    return 'جاري تحديد الاتجاه...';
  };

  // تنسيق عرض الدرجة
  const formatDegree = degree => {
    if (degree === null) return '--';
    return Math.round(degree) + '°';
  };

  // حساب الزاوية التي سيتم تدوير البوصلة إليها
  const getCompassRotation = () => {
    if (orientation === null) return 0;
    return -orientation; // دوران عكسي للبوصلة مع اتجاه الجهاز
  };

  // حساب الزاوية التي سيتم تدوير مؤشر القبلة إليها
  const getQiblaPointerRotation = () => {
    if (orientation === null || qiblaDirection === null) return 0;
    return qiblaDirection - orientation; // الفرق بين اتجاه القبلة واتجاه الجهاز
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-4 text-center"
      >
        تحديد اتجاه القبلة
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 text-center"
      >
        <p className="text-base-content/70">
          استخدم هذه البوصلة لتحديد اتجاه القبلة من موقعك الحالي
          <button
            className="btn btn-ghost btn-sm btn-circle ml-1"
            onClick={() => setShowInfo(!showInfo)}
          >
            <HelpCircle size={18} />
          </button>
        </p>
      </motion.div>

      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-base-200 p-4 rounded-lg mb-6"
        >
          <h3 className="font-bold mb-2">كيف تعمل بوصلة القبلة؟</h3>
          <p className="text-sm mb-2">
            تستخدم هذه الميزة مستشعرات جهازك والإحداثيات الجغرافية لتحديد اتجاه
            القبلة.
          </p>
          <ul className="text-sm list-disc list-inside">
            <li>تأكد من السماح بالوصول إلى موقعك والمستشعرات على جهازك</li>
            <li>امسك جهازك بشكل مستوٍ (أفقيًا) للحصول على قراءة دقيقة</li>
            <li>قد تحتاج إلى معايرة البوصلة باتباع تعليمات المعايرة</li>
            <li>استدر ببطء حتى يشير السهم إلى اتجاه القبلة</li>
          </ul>
        </motion.div>
      )}

      {permissionStatus === 'unsupported' && (
        <div className="alert alert-error text-center my-8">
          <AlertCircle />
          <span>جهازك لا يدعم مستشعر البوصلة. لا يمكن تحديد اتجاه القبلة.</span>
        </div>
      )}

      {permissionStatus === 'requires-permission' && (
        <div className="flex flex-col items-center justify-center my-12">
          <button
            className="btn btn-primary btn-lg gap-2 mb-4"
            onClick={requestPermission}
          >
            <LocateFixed />
            السماح بالوصول للبوصلة
          </button>
          <p className="text-sm text-center text-base-content/70">
            نحتاج إذنك للوصول إلى مستشعرات الجهاز لتحديد اتجاه القبلة
          </p>
        </div>
      )}

      {permissionStatus === 'denied' && (
        <div className="alert alert-warning text-center my-8">
          <AlertCircle />
          <div>
            <h3 className="font-bold">لم يتم منح الإذن</h3>
            <p className="text-sm">
              يرجى تمكين الوصول إلى المستشعرات في إعدادات المتصفح ثم إعادة تحميل
              الصفحة
            </p>
          </div>
        </div>
      )}

      {permissionStatus === 'granted' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-64 h-64 mb-8">
            {/* قرص البوصلة */}
            <motion.div
              className="w-full h-full rounded-full bg-base-300 border-4 border-base-content/10 relative overflow-hidden flex items-center justify-center"
              style={{
                transform: `rotate(${getCompassRotation()}deg)`
              }}
              transition={{ type: 'spring', stiffness: 50 }}
            >
              {/* علامات الاتجاهات الأساسية */}
              <div className="absolute top-4 text-sm font-bold">N</div>
              <div className="absolute right-4 text-sm font-bold">E</div>
              <div className="absolute bottom-4 text-sm font-bold">S</div>
              <div className="absolute left-4 text-sm font-bold">W</div>

              {/* خطوط البوصلة */}
              <div className="absolute w-full h-[1px] bg-base-content/20"></div>
              <div className="absolute w-[1px] h-full bg-base-content/20"></div>
              <div className="absolute w-full h-[1px] bg-base-content/20 rotate-45"></div>
              <div className="absolute w-full h-[1px] bg-base-content/20 -rotate-45"></div>

              {/* إبرة البوصلة */}
              <div className="absolute w-1 h-1/2 flex flex-col">
                <div className="flex-1 w-full bg-red-500"></div>
                <div className="flex-1 w-full bg-base-content"></div>
              </div>

              {/* دائرة المركز */}
              <div className="absolute w-4 h-4 rounded-full bg-base-content"></div>
            </motion.div>

            {/* مؤشر القبلة */}
            {qiblaDirection !== null && (
              <motion.div
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                animate={{ rotate: getQiblaPointerRotation() }}
                transition={{ type: 'spring', stiffness: 50 }}
              >
                <div className="absolute w-full h-0 flex justify-center items-start">
                  <div className="relative h-28">
                    <div className="absolute top-0 transform -translate-x-1/2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                        <MapPin className="text-primary-content" size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {isCalibrating && (
              <div className="absolute inset-0 flex items-center justify-center bg-base-200 bg-opacity-70 rounded-full">
                <div className="loading loading-spinner loading-lg text-primary"></div>
              </div>
            )}
          </div>

          <div className="stats shadow mb-6">
            <div className="stat">
              <div className="stat-title">اتجاه الجهاز</div>
              <div className="stat-value">{formatDegree(orientation)}</div>
              <div className="stat-desc">من اتجاه الشمال</div>
            </div>

            <div className="stat">
              <div className="stat-title">اتجاه القبلة</div>
              <div className="stat-value">{formatDegree(qiblaDirection)}</div>
              <div className="stat-desc">من اتجاه الشمال</div>
            </div>
          </div>

          <div
            className={`text-center p-4 rounded-lg max-w-md mb-6 ${getDirectionColor()} font-bold text-xl`}
          >
            {getDirectionMessage()}
          </div>

          <button className="btn btn-outline gap-2" onClick={startCompass}>
            <Crosshair />
            إعادة ضبط البوصلة
          </button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-4 bg-base-200 rounded-lg"
      >
        <h3 className="font-bold mb-2">نصائح للاستخدام:</h3>
        <ul className="list-disc list-inside text-base-content/70">
          <li>امسك جهازك بشكل أفقي للحصول على قراءات دقيقة</li>
          <li>
            قم بمعايرة البوصلة من خلال تحريك الجهاز على شكل رقم 8 في الهواء
          </li>
          <li>
            ابتعد عن الأجهزة الكهربائية والمغناطيسية التي قد تتداخل مع البوصلة
          </li>
          <li>
            تأكد من وجودك في مكان مفتوح بعيدًا عن الهياكل المعدنية للحصول على
            دقة أعلى
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default QiblaPage;
